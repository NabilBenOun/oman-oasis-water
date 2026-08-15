import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oasis-oman-water.example"),
  title: "مياه الواحة | Oasis Oman Water",
  description:
    "توصيل مياه معبأة للمنازل والشركات في سلطنة عمان مع أحجام متعددة وخدمة مجدولة.",
  openGraph: {
    title: "مياه الواحة | Oasis Oman Water",
    description:
      "اطلب مياه معبأة نقية تصل إلى بابك في مسقط وباقي محافظات عمان.",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 1024,
        alt: "عبوات مياه معبأة من Oasis Oman Water",
      },
    ],
    locale: "ar_OM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مياه الواحة | Oasis Oman Water",
    description: "توصيل مياه معبأة في سلطنة عمان.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
