import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, Card, Toggle, field } from "../components/ui";
import { readFileAsDataURL, validatePassword } from "../utils";

export default function Settings() {
  const { user, setUser, resetData } = useApp();
  const [form, setForm] = useState({ ...user, newPassword: "" });
  const [changePw, setChangePw] = useState(false);
  const [msg, setMsg] = useState("");

  function pickImage(e) {
    const file = e.target.files?.[0];
    readFileAsDataURL(
      file,
      (avatar) => setForm((f) => ({ ...f, avatar })),
      (err) => setMsg(err)
    );
  }

  function save(e) {
    e.preventDefault();
    if (changePw) {
      const pwError = validatePassword(form.newPassword);
      if (pwError) return setMsg(pwError);
    }
    const { newPassword, ...rest } = form;
    setUser(rest);
    setMsg("Changes saved");
  }
  const setN = (k) => (v) => setForm({ ...form, notifications: { ...form.notifications, [k]: v } });

  return (
    <form onSubmit={save} className="grid gap-4 lg:grid-cols-2">
      <Card title="Profile setting">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Name<input className={`${field} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-medium">Email<input type="email" className={`${field} mt-1`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <div className="flex items-center justify-between"><span className="text-sm font-medium">Change password</span><Toggle label="Change password" checked={changePw} onChange={setChangePw} /></div>
          {changePw && <input type="password" placeholder="New password" className={field} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />}
          <p className="pt-2 text-sm font-medium">Profile picture</p>
          <div className="flex items-center gap-4">
            <Avatar name={form.name} src={form.avatar} size="size-20" />
            <label className="cursor-pointer rounded-lg bg-neutral-100 px-5 py-4 text-center text-sm font-medium hover:bg-neutral-200">
              Upload picture<input type="file" accept="image/*" onChange={pickImage} className="sr-only" />
            </label>
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        <Card title="Notification setting">
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span>Email notification</span><Toggle label="Email notification" checked={form.notifications.email} onChange={setN("email")} /></div>
            <div className="flex items-center justify-between"><span>SMS notification</span><Toggle label="SMS notification" checked={form.notifications.sms} onChange={setN("sms")} /></div>
          </div>
        </Card>
        <Card title="Demo data">
          <p className="mb-3 text-sm text-neutral-600">Products and orders are saved in your browser. Reset to start from the sample data again.</p>
          <button type="button" onClick={() => { resetData(); setMsg("Sample data restored"); }} className="rounded-full border border-neutral-300 px-5 py-2 text-sm">Reset sample data</button>
        </Card>
      </div>
      <div className="flex items-center gap-4 lg:col-span-2">
        <button className="rounded-full bg-navy px-8 py-3 font-medium text-white">Save changes</button>
        {msg && <span role="status" className="text-sm text-neutral-600">{msg}</span>}
      </div>
    </form>
  );
}
