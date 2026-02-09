"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router, supabase.auth]);

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

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="loading-spinner" />
      </div>
    );
  }

  const workflows = [
    { icon: "📝", name: "TradeMe Listings", desc: "Professional property descriptions" },
    { icon: "✉️", name: "Email Templates", desc: "Vendor updates & buyer follow-ups" },
    { icon: "📱", name: "Social Media Posts", desc: "Instagram, Facebook & LinkedIn" },
    { icon: "🏠", name: "Open Home Scripts", desc: "Talking points & follow-up" },
    { icon: "📊", name: "Market Updates", desc: "Monthly vendor communications" },
    { icon: "🎯", name: "Listing Presentations", desc: "Win more listings" },
    { icon: "📞", name: "Cold Calling Scripts", desc: "Prospecting made easy" },
    { icon: "✨", name: "Property Highlights", desc: "Feature sheets & brochures" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "48px",
              fontWeight: "400",
              color: "var(--color-text)",
              marginBottom: "16px",
            }}
          >
            AgentCopy
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "var(--color-muted)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            AI-powered writing assistant built specifically for New Zealand real estate agents
          </p>
        </div>

        {/* Pricing Card */}
        <div
          style={{
            backgroundColor: "var(--color-card)",
            borderRadius: "16px",
            border: "1px solid var(--color-border)",
            padding: "40px",
            marginBottom: "32px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-accent)",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "16px",
              }}
            >
              One-time purchase
            </div>
            <div
              style={{
                fontSize: "56px",
                fontWeight: "600",
                color: "var(--color-text)",
                lineHeight: "1",
              }}
            >
              $99
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  color: "var(--color-muted)",
                }}
              >
                {" "}
                NZD
              </span>
            </div>
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-muted)",
                marginTop: "8px",
              }}
            >
              500 conversations included
            </p>
          </div>

          {/* What's Included */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: "16px",
              }}
            >
              Everything you need to write faster:
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              {workflows.map((workflow) => (
                <div
                  key={workflow.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    backgroundColor: "var(--color-bg)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{workflow.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--color-text)",
                      }}
                    >
                      {workflow.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-muted)",
                      }}
                    >
                      {workflow.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div
            style={{
              backgroundColor: "var(--color-bg)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                "NZ-specific real estate terminology",
                "Compliant with REA guidelines",
                "No subscription — buy more when you need",
                "Works on desktop and mobile",
              ].map((benefit) => (
                <div
                  key={benefit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ display: "block" }}
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "var(--color-text)",
                    }}
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 32px",
              backgroundColor: "var(--color-accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Redirecting to checkout..." : "Get Started — $99 NZD"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "var(--color-muted)",
              marginTop: "16px",
            }}
          >
            Secure payment powered by Stripe
          </p>
        </div>

        {/* FAQ or additional info */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--color-muted)" }}>
            Questions?{" "}
            <a
              href="mailto:support@agentcopy.co.nz"
              style={{ color: "var(--color-accent)" }}
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
