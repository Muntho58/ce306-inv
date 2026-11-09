BEGIN;

INSERT INTO categories (name)
VALUES ('Perfume'), ('Accessories'), ('Fashion'), ('House Decor'), ('Electronics')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (
    sku, name, category_id, current_stock, predicted_stock, price, status, total_sales, image_url
)
SELECT
    data.sku,
    data.name,
    categories.id,
    data.current_stock,
    data.predicted_stock,
    data.price,
    data.status,
    data.total_sales,
    data.image_url
FROM (
    VALUES
        ('RT15246630', 'Blossom mist soft rose', 'Perfume', 12, 100, 45.00, 'Active', 9856, '/products/perfume.svg'),
        ('RT15246540', 'Classic leather chrono', 'Accessories', 150, 450, 120.00, 'Active', 495, '/products/chrono.svg'),
        ('RT15249828', 'Chromium bag', 'Fashion', 129, 189, 80.00, 'Active', 7890, '/products/bag.svg'),
        ('RT15244830', 'Sofa coco single', 'House Decor', 65, 88, 300.00, 'Active', 125, '/products/sofa.svg'),
        ('RT15243690', 'Golden bracelet plated', 'Accessories', 0, 60, 65.00, 'Active', 310, '/products/bracelet.svg'),
        ('RT15243790', 'Mechanical keyboard 80', 'Electronics', 8, 40, 199.99, 'Inactive', 220, '/products/keyboard.svg')
) AS data(sku, name, category_name, current_stock, predicted_stock, price, status, total_sales, image_url)
JOIN categories ON categories.name = data.category_name
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    current_stock = EXCLUDED.current_stock,
    predicted_stock = EXCLUDED.predicted_stock,
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    total_sales = EXCLUDED.total_sales,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

INSERT INTO customers (name, email)
VALUES
    ('Hiiro Yui', 'HiiroYui@gmail.com'),
    ('David Martinez', 'Davidmartinez@gmail.com'),
    ('Athrun Zala', 'Athrun.Zala@gmail.com'),
    ('Setsuna F. Seiei', 'Setsuna@gmail.com'),
    ('Lucyna Kushinada', 'LucynaKushinada@gmail.com')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO orders (id, customer_id, order_date, total, payment_status, status)
SELECT data.id, customers.id, data.order_date, data.total, data.payment_status, data.status
FROM (
    VALUES
        ('#ODR115753', 'HiiroYui@gmail.com', '2026-02-08 11:13:30+07'::timestamptz, 80.00, 'Paid', 'Accepted'),
        ('#ODR114586', 'Davidmartinez@gmail.com', '2026-05-10 10:30:00+07'::timestamptz, 120.00, 'Paid', 'New Order'),
        ('#ODR119875', 'Athrun.Zala@gmail.com', '2026-04-27 11:00:00+07'::timestamptz, 45.00, 'Paid', 'Ready to ship'),
        ('#ODR113389', 'Setsuna@gmail.com', '2026-04-29 14:00:00+07'::timestamptz, 300.00, 'Pending', 'Delivered'),
        ('#ODR115544', 'LucynaKushinada@gmail.com', '2026-05-04 19:30:00+07'::timestamptz, 240.00, 'Unpaid', 'Returned')
) AS data(id, customer_email, order_date, total, payment_status, status)
JOIN customers ON customers.email = data.customer_email
ON CONFLICT (id) DO UPDATE SET
    customer_id = EXCLUDED.customer_id,
    order_date = EXCLUDED.order_date,
    total = EXCLUDED.total,
    payment_status = EXCLUDED.payment_status,
    status = EXCLUDED.status;

DELETE FROM order_items
WHERE order_id IN ('#ODR115753', '#ODR114586', '#ODR119875', '#ODR113389', '#ODR115544');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT data.order_id, products.id, data.quantity, data.unit_price
FROM (
    VALUES
        ('#ODR115753', 'RT15249828', 1, 80.00),
        ('#ODR114586', 'RT15246540', 1, 120.00),
        ('#ODR119875', 'RT15246630', 1, 45.00),
        ('#ODR113389', 'RT15244830', 1, 300.00),
        ('#ODR115544', 'RT15249828', 3, 80.00)
) AS data(order_id, product_sku, quantity, unit_price)
JOIN products ON products.sku = data.product_sku;

COMMIT;
