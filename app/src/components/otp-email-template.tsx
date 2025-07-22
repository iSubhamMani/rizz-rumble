import * as React from "react";

interface EmailTemplateProps {
  otp: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ otp }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#0b0b0b", // Keeping dark background for contrast
      padding: "40px 24px",
      color: "#ffffff",
      border: "1px solid #d97706", // amber-700 for the main border
      borderRadius: "12px",
      maxWidth: "600px",
      margin: "0 auto",
      // Adjusted boxShadow to use amber colors, creating a warm glow
      boxShadow: "0 0 20px #f59e0b, 0 0 40px #d97706",
    }}
  >
    <h1
      style={{
        color: "#f59e0b", // amber-500 for the main heading color
        textTransform: "uppercase",
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "24px",
      }}
    >
      Welcome Soldier!
    </h1>

    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.6",
        textAlign: "center",
        color: "#fff",
      }}
    >
      Verify your email to claim your username. Your OTP is:
    </p>

    <div
      style={{
        // Using amber with transparency for the OTP background
        backgroundColor: "rgba(245, 158, 11, 0.2)", // f59e0b with 20% opacity
        padding: "16px 24px",
        borderRadius: "8px",
        fontSize: "32px",
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: "8px",
        textAlign: "center",
        margin: "24px auto",
        width: "fit-content",
        border: "1px solid #f59e0b", // amber-500 for the OTP box border
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
        color: "#fbbf24", // Lighter amber-300 for the team signature, for slight contrast
      }}
    >
      — The Prompt Brawl Team ⚔️
    </p>
  </div>
);
