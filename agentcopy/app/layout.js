import "./globals.css";

export const metadata = {
  title: "AgentCopy — AI Writing for NZ Real Estate",
  description:
    "Write listings, vendor updates, and marketing copy in seconds. Built for New Zealand real estate agents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
