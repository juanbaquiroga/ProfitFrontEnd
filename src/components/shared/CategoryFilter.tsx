import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
    categories: string[];
    activeCategory: string | undefined;
    setActiveCategory: (value: string | undefined) => void;
}

export const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: CategoryFiltersProps) => {

    return (
        <div className="flex flex-row w-min gap-2 items-center overflow-x-auto py-2 px-1 scrollbar-hide rounded-4xl bg-white">
            <button
                onClick={() => setActiveCategory(undefined)}
                className={cn(
                    "px-6 py-2.5 rounded-full text-sm h-min font-bold whitespace-nowrap transition-all",
                    activeCategory === undefined
                        ? "bg-[#047857] text-white shadow-sm"
                        : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
            >
                Todos los Productos
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                        activeCategory === category
                            ? "bg-[#047857] text-white shadow-sm"
                            : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};