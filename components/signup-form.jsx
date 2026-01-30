"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Registrar usuario
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear usuario");
        setLoading(false);
        return;
      }

      // Login automático después del registro
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Usuario creado pero error al iniciar sesión");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-gray-500">Completa los datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre (opcional)
            </label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">¿Ya tienes cuenta? </span>
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
  );
}