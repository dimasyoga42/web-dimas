"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      // auto login setelah register berhasil
      await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false,
      });

      setLoading(false);
      router.push("/");
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm border-2 border-black bg-white p-8">
        <h1 className="font-heading font-extrabold text-2xl text-center">
          {mode === "login" ? "Login" : "Daftar Akun"}
        </h1>
        <p className="font-body text-sm text-gray-500 text-center mt-1 mb-8">
          {mode === "login"
            ? "Masuk ke akun kamu"
            : "Buat akun baru untuk mulai"}
        </p>

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className="flex flex-col gap-5"
        >
          {mode === "register" && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="border-b-2 border-black px-1 py-2 font-body text-sm bg-transparent focus:outline-none focus:border-green-500"
              required
            />
          )}

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
            {loading ? "Memproses..." : mode === "login" ? "Login" : "Daftar"}
          </button>
        </form>

        <p className="font-body text-sm text-center mt-6 text-gray-600">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="font-semibold text-green-600 hover:underline"
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-semibold text-green-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
