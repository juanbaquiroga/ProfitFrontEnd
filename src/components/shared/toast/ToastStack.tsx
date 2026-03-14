"use client";

import { useState, useRef } from "react";
import { useToastStore } from "@/store/useToastStore";
import { ToastItem } from "./ToastItem";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const ToastStack = () => {
  const { toasts } = useToastStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".toast-item");
    
    items.forEach((item, index) => {
      // En Sileo, el index 0 es el que está al frente (más reciente)
      const isTop = index === 0;
      
      if (isExpanded) {
        // Estado Expandido: Lista normal con separación
        gsap.to(item, {
          y: index * 70, // Espaciado vertical
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.2)",
          overwrite: true,
        });
      } else {
        // Estado Stacked: Apilados uno tras otro
        gsap.to(item, {
          y: index * 12, // Ligero asomo
          scale: 1 - index * 0.05,
          opacity: index > 2 ? 0 : 1 - index * 0.2,
          duration: 0.5,
          ease: "expo.out",
          overwrite: true,
        });
      }
    });
  }, [toasts, isExpanded]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      {toasts.map((toast, index) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          index={index} 
          isExpanded={isExpanded}
        />
      ))}
    </div>
  );
};