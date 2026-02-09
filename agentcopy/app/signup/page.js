"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
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
            Get started
          </h1>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            Create your account to start writing
          </p>

          <form onSubmit={handleSignup}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Jane Brown"
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
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
              {loading ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "var(--color-accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
