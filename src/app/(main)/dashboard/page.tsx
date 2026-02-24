"use client"
import { ProductTable } from "@/components/shared/ProductsTable";
import { useProducts } from "@/hooks/useProducts";

export default function Dashboard() {
  const { data } = useProducts();

  return (
    <div className="flex w-auto flex-row ml-auto">
    </div>
  );
}
