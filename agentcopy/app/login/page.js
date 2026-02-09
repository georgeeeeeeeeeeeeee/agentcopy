"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--color-bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 40,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
            AgentCopy
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--color-card)",
            border: "1.5px solid var(--color-border)",
            borderRadius: 16,
            padding: "32px 28px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            Sign in to access your AI writing tools
          </p>

          <form onSubmit={handleLogin}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--color-text)",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid var(--color-border)",
                borderRadius: 10,
                fontSize: 15,
                marginBottom: 16,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "var(--font-body)",
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--color-text)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid var(--color-border)",
                borderRadius: 10,
                fontSize: 15,
                marginBottom: 24,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "var(--font-body)",
              }}
            />

            {error && (
              <p
                style={{
                  color: "#c0392b",
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 0",
                background: loading
                  ? "var(--color-muted)"
                  : "var(--color-accent)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                fontFamily: "var(--font-body)",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 14,
              color: "var(--color-muted)",
            }}
          >
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "var(--color-accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
