import "dotenv/config";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE || "Minipro",
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD,
      }
);

const app = express();
const port = Number(process.env.API_PORT || 3001);

app.use(express.json({ limit: "2mb" }));

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const productSelect = `
  SELECT p.id, p.sku, p.name, c.name AS category,
         p.current_stock AS "currentStock",
         p.predicted_stock AS "predictedStock",
         p.price, p.status, p.total_sales AS "totalSales",
         COALESCE(p.image_url, '') AS image
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

function mapProduct(row) {
  return {
    ...row,
    id: Number(row.id),
    currentStock: Number(row.currentStock),
    predictedStock: Number(row.predictedStock),
    price: Number(row.price),
    totalSales: Number(row.totalSales),
  };
}

app.get(
  "/api/health",
  asyncRoute(async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  })
);

app.get(
  "/api/products",
  asyncRoute(async (_req, res) => {
    const { rows } = await pool.query(`${productSelect} ORDER BY p.id`);
    res.json(rows.map(mapProduct));
  })
);

app.post(
  "/api/products",
  asyncRoute(async (req, res) => {
    const { id, sku, name, category, currentStock, predictedStock, price, status, image } =
      req.body ?? {};
    if (
      typeof sku !== "string" ||
      !sku.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isInteger(Number(currentStock)) ||
      Number(currentStock) < 0 ||
      !Number.isInteger(Number(predictedStock)) ||
      Number(predictedStock) < 0 ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({ error: "ข้อมูลสินค้าไม่ถูกต้อง" });
    }

    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE name = $1",
      [category.trim()]
    );
    if (categoryResult.rowCount === 0) {
      return res.status(400).json({ error: "ไม่พบหมวดหมู่สินค้านี้ในฐานข้อมูล" });
    }

    const values = [
      sku.trim(),
      name.trim(),
      categoryResult.rows[0].id,
      Number(currentStock),
      Number(predictedStock),
      Number(price),
      status === "Inactive" ? "Inactive" : "Active",
      typeof image === "string" && image ? image : null,
    ];

    let productId;
    if (id !== undefined && id !== null) {
      const result = await pool.query(
        `UPDATE products
         SET sku = $1, name = $2, category_id = $3, current_stock = $4,
             predicted_stock = $5, price = $6, status = $7, image_url = $8,
             updated_at = NOW()
         WHERE id = $9
         RETURNING id`,
        [...values, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการแก้ไข" });
      }
      productId = result.rows[0].id;
    } else {
      const result = await pool.query(
        `INSERT INTO products
           (sku, name, category_id, current_stock, predicted_stock, price, status, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        values
      );
      productId = result.rows[0].id;
    }

    const saved = await pool.query(`${productSelect} WHERE p.id = $1`, [productId]);
    res.json(mapProduct(saved.rows[0]));
  })
);

app.get(
  "/api/orders",
  asyncRoute(async (_req, res) => {
    const { rows } = await pool.query(`
      SELECT o.id, o.customer_id AS "customerId", c.name AS "customerName",
             c.email AS "customerEmail", o.order_date AS date, o.total,
             o.payment_status AS payment, o.status,
             oi.product_id AS "productId", oi.quantity AS qty, oi.unit_price AS "unitPrice"
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ORDER BY o.order_date DESC, o.id
    `);

    const orders = new Map();
    for (const row of rows) {
      let order = orders.get(row.id);
      if (!order) {
        order = {
          id: row.id,
          customerId: Number(row.customerId),
          customer: { name: row.customerName, email: row.customerEmail },
          date: row.date.toISOString(),
          total: Number(row.total),
          payment: row.payment,
          status: row.status,
          items: [],
        };
        orders.set(row.id, order);
      }
      if (row.productId !== null) {
        order.items.push({
          productId: Number(row.productId),
          qty: Number(row.qty),
          unitPrice: Number(row.unitPrice),
        });
      }
    }
    res.json([...orders.values()]);
  })
);

app.patch(
  "/api/orders/:id/status",
  asyncRoute(async (req, res) => {
    const allowedStatuses = ["New Order", "Accepted", "Ready to ship", "Delivered", "Returned"];
    const { status } = req.body ?? {};
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "สถานะคำสั่งซื้อไม่ถูกต้อง" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const orderResult = await client.query(
        "SELECT status FROM orders WHERE id = $1 FOR UPDATE",
        [req.params.id]
      );
      if (orderResult.rowCount === 0) {
        const error = new Error("ไม่พบคำสั่งซื้อ");
        error.statusCode = 404;
        throw error;
      }

      const currentStatus = orderResult.rows[0].status;
      if (currentStatus === "New Order" && status === "Accepted") {
        const { rows } = await client.query(
          `SELECT oi.product_id, oi.quantity, p.current_stock
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = $1
           FOR UPDATE OF p`,
          [req.params.id]
        );
        const shortage = rows.find((item) => item.current_stock < item.quantity);
        if (shortage) {
          const error = new Error("สินค้าในสต็อกไม่เพียงพอสำหรับรับคำสั่งซื้อนี้");
          error.statusCode = 409;
          throw error;
        }
        for (const item of rows) {
          await client.query(
            `UPDATE products
             SET current_stock = current_stock - $1, updated_at = NOW()
             WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      }

      if (status === "Returned" && currentStatus !== "Returned") {
        await client.query(
          `UPDATE products p
           SET current_stock = p.current_stock + oi.quantity, updated_at = NOW()
           FROM order_items oi
           WHERE oi.order_id = $1 AND oi.product_id = p.id`,
          [req.params.id]
        );
      }

      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
        status,
        req.params.id,
      ]);
      await client.query("COMMIT");
      res.json({ id: req.params.id, status });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  })
);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "23505") {
    return res.status(409).json({ error: "SKU นี้มีอยู่ในระบบแล้ว" });
  }
  res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
  });
});

const server = app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  });
}
