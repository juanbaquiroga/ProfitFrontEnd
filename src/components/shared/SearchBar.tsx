import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export const SearchBar = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {

    // Estado local INMEDIATO para la UI (para que al teclear se vea fluido)
    const [localValue, setLocalValue] = useState(value);
    // Efecto Debounce: Sincroniza el localValue con el onChange del padre
    useEffect(() => {
        // Detectar si parece un código de barras (suelen ser largos y sin espacios)
        const isBarcode = localValue.length > 7 && !localValue.includes(" ");

        // Si es un código de barras, NO ESPERAMOS. Buscamos instantáneamente.
        // Si el usuario borró todo (""), tampoco esperamos, limpiamos instantáneamente.
        if (isBarcode || localValue === "") {
            onChange(localValue);
            return;
        }
        // Si es un humano tecleando letras normales, esperamos 400ms
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 400);
        // Si el usuario escribe otra letra antes de los 400ms, el timeout viejo se cancela
        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    return (
        <div className="relative w-full flex items-center pl-3 justify-start max-w-md h-11 bg-card rounded-2xl border border-border transition-colors focus-within:border-profit focus-within:ring-2 focus-within:ring-profit/20">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Escanear o buscar producto..."
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="border-none text-primary font-semibold h-11 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent"
                autoFocus
            />
        </div>
    );
};