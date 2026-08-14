"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Username atau password salah");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm border-2 border-black bg-white p-8">
        <h1 className="font-heading font-extrabold text-2xl text-center">
          Login
        </h1>
        <p className="font-body text-sm text-gray-500 text-center mt-1 mb-8">
          Masuk ke akun kamu
        </p>

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border-b-2 border-black px-1 py-2 font-body text-sm bg-transparent focus:outline-none focus:border-green-500"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-b-2 border-black px-1 py-2 font-body text-sm bg-transparent focus:outline-none focus:border-green-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 border-2 border-black bg-green-500 text-white font-heading font-bold text-sm py-2.5 hover:bg-black transition-colors duration-150 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
