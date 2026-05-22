import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель Администратора — Hoomy",
  description: "Веб-интерфейс администратора Hoomy для модерации каталога, верификации поставщиков и разрешения споров.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
