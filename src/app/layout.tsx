import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "菜单 / 菜谱管理 MVP",
  description: "移动端优先的菜单与菜单集合分享原型"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
