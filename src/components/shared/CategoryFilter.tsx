import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
    categories: string[];
    activeCategory: string | undefined;
    setActiveCategory: (value: string | undefined) => void;
}

export const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: CategoryFiltersProps) => {

    return (
        <div className="flex flex-row w-full max-w-mingv gap-2 items-center overflow-x-auto overflow-y-hidden no-scrollbar py-2 px-1 rounded-4xl bg-white">
            <button
                onClick={() => setActiveCategory(undefined)}
                className={cn(
                    "px-6 py-2.5 rounded-full text-sm h-min font-bold whitespace-nowrap transition-all",
                    activeCategory === undefined
                        ? "bg-profit text-primary shadow-sm"
                        : "bg-transparent text-slate-500 hover:text-primary hover:bg-slate-50"
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
                            ? "bg-profit text-primary shadow-sm"
                            : "bg-transparent text-slate-500 hover:text-primary hover:bg-slate-50"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};