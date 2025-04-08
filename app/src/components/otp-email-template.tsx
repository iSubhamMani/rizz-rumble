import * as React from "react";

interface EmailTemplateProps {
  otp: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ otp }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#0b0b0b",
      padding: "40px 24px",
      color: "#ffffff",
      border: "1px solid #a78bfa", // violet-400
      borderRadius: "12px",
      maxWidth: "600px",
      margin: "0 auto",
      boxShadow: "0 0 20px #8b5cf6, 0 0 40px #8b5cf6",
    }}
  >
    <h1
      style={{
        color: "#a78bfa", // violet-400
        textTransform: "uppercase",
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "24px",
      }}
    >
      Welcome, Soldier!
    </h1>

    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.6",
        textAlign: "center",
        color: "#fff",
      }}
    >
      Verify your email to claim your username! Your OTP is:
    </p>

    <div
      style={{
        backgroundColor: "#a78bfa33", // violet with transparency
        padding: "16px 24px",
        borderRadius: "8px",
        fontSize: "32px",
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: "8px",
        textAlign: "center",
        margin: "24px auto",
        width: "fit-content",
        border: "1px solid #8b5cf6",
      }}
    >
      {otp}
    </div>

    <p
      style={{
        fontSize: "14px",
        textAlign: "center",
        opacity: 0.8,
        color: "#fff",
      }}
    >
      This OTP is valid for 10 minutes. Please do not share it with anyone.
    </p>

    <p
      style={{
        fontSize: "14px",
        textAlign: "center",
        marginTop: "32px",
        opacity: 0.6,
        color: "#fff",
      }}
    >
      If you didn&apos;t request this, you can safely ignore this email.
    </p>

    <p
      style={{
        fontSize: "14px",
        marginTop: "32px",
        textAlign: "center",
        color: "#a78bfa",
      }}
    >
      — The Prompt Brawl Team ⚔️
    </p>
  </div>
);
