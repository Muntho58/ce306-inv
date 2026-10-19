import { useState } from "react";
import { Navigate } from "react-router";
import { useApp } from "../context/AppContext";
import { field } from "../components/ui";

export default function Login() {
  const { loggedIn, login } = useApp();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  if (loggedIn) return <Navigate to="/" replace />;

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); setError(login(email, password) || ""); }} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <label className="block text-sm">Email<input className={`${field} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm">Password<input className={`${field} mt-1`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-navy py-2 font-medium text-white">Sign in</button>
      </form>
    </div>
  );
}
