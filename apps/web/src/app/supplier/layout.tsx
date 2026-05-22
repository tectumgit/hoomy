import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кабинет Поставщика — Hoomy",
  description: "Веб-интерфейс поставщика Hoomy для управления товарами, заказами и доставкой.",
};

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
