"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const [status, setStatus] = useState("verifying");
  const [credits, setCredits] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/dashboard");
      return;
    }

    // Poll for credits update
    let attempts = 0;
    const maxAttempts = 10;

    const checkCredits = async () => {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();

        if (data.credits > 0) {
          setCredits(data.credits);
          setStatus("success");
          // Redirect to dashboard after showing success
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkCredits, 1000);
        } else {
          setStatus("pending");
        }
      } catch (error) {
        console.error("Error checking credits:", error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkCredits, 1000);
        } else {
          setStatus("error");
        }
      }
    };

    checkCredits();
  }, [sessionId, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-card)",
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          padding: "48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {status === "verifying" && (
          <>
            <div className="loading-spinner" style={{ margin: "0 auto 24px" }} />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              Setting up your account...
            </h1>
            <p style={{ color: "var(--color-muted)" }}>
              This will only take a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              You're all set!
            </h1>
            <p style={{ color: "var(--color-muted)", marginBottom: "8px" }}>
              {credits} credits have been added to your account.
            </p>
            <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <span style={{ fontSize: "32px" }}>⏳</span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              Payment received!
            </h1>
            <p style={{ color: "var(--color-muted)", marginBottom: "24px" }}>
              Your credits are being processed. This usually takes a few seconds.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              Something went wrong
            </h1>
            <p style={{ color: "var(--color-muted)", marginBottom: "24px" }}>
              Please contact support if your credits don't appear.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
