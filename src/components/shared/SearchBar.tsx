import { useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export const SearchBar = ({
    value,
    onChange,
    onSearchEnter
}: {
    value: string,
    onChange: (value: string) => void,
    onSearchEnter?: (value: string) => void
}) => {

    // Estado local INMEDIATO para la UI (para que al teclear se vea fluido)
    const [localValue, setLocalValue] = useState(value);
    const localValueRef = useRef(value);

    // Sincronizar hacia abajo si el padre limpia el buscador
    useEffect(() => {
        if (value === "") {
            setLocalValue("");
            localValueRef.current = "";
        }
    }, [value]);

    const callbacksRef = useRef({ onChange, onSearchEnter });
    useEffect(() => {
        callbacksRef.current = { onChange, onSearchEnter };
    }, [onChange, onSearchEnter]);

    // Enfoque automático y recolección de pulsaciones a nivel global (ideal para lector de código de barras rápido)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            // Ignorar si el usuario ya está escribiendo activamente en otro campo de texto
            if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.id !== 'search-input-field') {
                return;
            }

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            // Si el evento NO fue dirigido nativamente a la barra de búsqueda, lo interceptamos
            if (target.id !== 'search-input-field') {
                const isPrintable = e.key.length === 1;

                if (isPrintable) {
                    e.preventDefault();
                    localValueRef.current += e.key;
                    setLocalValue(localValueRef.current);

                    const inputEl = document.getElementById('search-input-field') as HTMLInputElement;
                    if (inputEl) {
                        inputEl.value = localValueRef.current; // Sincronización DOM CRÍTICA para lectores veloces
                        inputEl.focus();
                    }
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    localValueRef.current = localValueRef.current.slice(0, -1);
                    setLocalValue(localValueRef.current);

                    const inputEl = document.getElementById('search-input-field') as HTMLInputElement;
                    if (inputEl) {
                        inputEl.value = localValueRef.current;
                        inputEl.focus();
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const finalValue = localValueRef.current;
                    callbacksRef.current.onChange(finalValue);
                    if (callbacksRef.current.onSearchEnter) {
                        callbacksRef.current.onSearchEnter(finalValue);
                    }
                }
            }
        };

        // Escuchamos en fase capture para procesarlo antes que nadie
        window.addEventListener("keydown", handleGlobalKeyDown, true);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown, true);
    }, []);

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

    // Update parent onChange explicitly if LATEST is needed by enter but timeout hasn't fired
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Leemos el valor directo del DOM porque es MÁS rápido que el estado de React 
            // Esto es crucial para los lectores de barra muy veloces.
            const currentValue = e.currentTarget.value;
            setLocalValue(currentValue);
            onChange(currentValue);
            if (onSearchEnter) {
                onSearchEnter(currentValue);
            }
        }
    };

    return (
        <div className="relative w-full flex items-center pl-3 justify-start max-w-md h-11 bg-card rounded-2xl border border-border transition-colors focus-within:border-profit focus-within:ring-2 focus-within:ring-profit/20">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
                id="search-input-field"
                placeholder="Escanear o buscar producto..."
                value={localValue}
                onChange={(e) => {
                    setLocalValue(e.target.value);
                    localValueRef.current = e.target.value;
                }}
                onKeyDown={handleKeyDown}
                className="border-none text-primary font-semibold h-11 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent"
                autoFocus
            />
        </div>
    );
};