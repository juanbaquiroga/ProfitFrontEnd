"use client"
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { ProductTable } from "@/components/shared/ProductsTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { useMemo, useState } from "react";

export default function Sell() {
  const { data } = useProducts();
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((p) => p.categoria.nombre)));
  }, [data]);

  return (
    <div className="flex h-full flex-row w-full overflow-hidden bg-white">
      <div className="flex w-full flex-col gap-4 p-4 h-full overflow-hidden">
        <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        <CategoryFilter categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <ProductTable data={data || []} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} activeCategory={activeCategory} pagination={true} pageSize={100} />
      </div>
    </div>
  );
}