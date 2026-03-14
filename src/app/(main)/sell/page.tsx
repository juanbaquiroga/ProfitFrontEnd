"use client"
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { ProductTable } from "@/components/shared/ProductsTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { Cart } from "@/components/shared/cart/Cart";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useMemo, useState } from "react";

export default function Sell() {
  const { data } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((p) => p.categoria.nombre)));
  }, [data]);

  // Parsear cantidad y término de búsqueda
  const parsedSearch = useMemo(() => {
    const match = globalFilter.match(/^(\d+)\+(.*)$/);
    if (match) {
      return { quantity: parseInt(match[1], 10), term: match[2] };
    }
    return { quantity: 1, term: globalFilter };
  }, [globalFilter]);

  // Agregar el primer producto al carrito al presionar Enter en el buscador
  const handleSearchEnter = (searchValue: string) => {
    if (!data || !searchValue.trim()) return;

    const match = searchValue.match(/^(\d+)\+(.*)$/);
    const quantity = match ? parseInt(match[1], 10) : 1;
    const term = match ? match[2] : searchValue;

    if (!term.trim()) return;

    // Igualamos la lógica de filtro global de Tanstack de forma manual simple
    const filtered = data.filter(p => {
      const searchLower = term.toLowerCase();
      const matchesSearch = p.nombre.toLowerCase().includes(searchLower) || p.codigo.toLowerCase().includes(searchLower);
      const matchesCategory = activeCategory && activeCategory !== "all" ? p.categoria.nombre === activeCategory : true;
      // Solo agregar si está disponible y tiene stock
      const isDisponible = p.disponible && p.stock > 0;
      return matchesSearch && matchesCategory && isDisponible;
    });

    if (filtered.length > 0) {
      addItem(filtered[0], quantity);
      setGlobalFilter(""); // Limpiar el input para el próximo escáner
    }
  };

  const handleRowClick = (product: any) => {
    addItem(product, parsedSearch.quantity);
    if (parsedSearch.quantity > 1) {
       setGlobalFilter(""); // Limpiamos si usamos un prefijo
    }
  };

  return (
    <div className="flex h-full flex-row w-full p-5 gap-5">
      <div className="flex w-full flex-col gap-5 h-full flex-1">
        <SearchBar
          value={globalFilter}
          onChange={setGlobalFilter}
          onSearchEnter={handleSearchEnter}
        />
        <CategoryFilter categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <ProductTable
          data={data || []}
          globalFilter={parsedSearch.term}
          setGlobalFilter={setGlobalFilter}
          activeCategory={activeCategory}
          pagination={true}
          pageSize={100}
          onRowClick={handleRowClick}
          visibleColumns={{ categoria: true, precioVenta: true, disponibilidad: true }}
        />
      </div>
      <Cart />
    </div>
  );
}