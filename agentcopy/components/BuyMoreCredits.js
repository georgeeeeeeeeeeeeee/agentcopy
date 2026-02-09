"use client";

import { useState } from "react";

export default function BuyMoreCredits({ variant = "full" }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "var(--color-accent)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "..." : "Buy Credits"}
      </button>
    );
  }

  // Full variant for the chat area when credits are 0
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "var(--color-accent-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "28px" }}>💳</span>
      </div>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "var(--color-text)",
          marginBottom: "8px",
        }}
      >
        You've used all your credits
      </h3>
      <p
        style={{
          fontSize: "15px",
          color: "var(--color-muted)",
          marginBottom: "24px",
          maxWidth: "300px",
        }}
      >
        Get 500 more conversations for $99 NZD to continue using AgentCopy.
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "14px 28px",
          backgroundColor: "var(--color-accent)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {loading ? "Redirecting..." : "Buy More Credits — $99"}
      </button>
    </div>
  );
}
