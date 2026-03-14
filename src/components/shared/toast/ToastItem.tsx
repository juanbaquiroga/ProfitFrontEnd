"use client";

import { Toast } from "@/types/toast.types";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useEffect } from "react";

const icons = {
  success: <CheckCircle2 className="text-green-500" size={18} />,
  error: <XCircle className="text-red-500" size={18} />,
  info: <Info className="text-blue-500" size={18} />,
  warning: <AlertCircle className="text-amber-500" size={18} />,
};

interface Props {
  toast: Toast;
  index: number;
  isExpanded: boolean;
}

export const ToastItem = ({ toast, index, isExpanded }: Props) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isExpanded) removeToast(toast.id);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [isExpanded, toast.id, toast.duration, removeToast]);

  return (
    <div
      className={cn(
        "toast-item absolute top-0 pointer-events-auto",
        "w-[350px] bg-zinc-900/95 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-2xl",
        "flex items-start gap-3 transition-colors duration-300",
        index === 0 ? "cursor-default" : "cursor-pointer"
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-zinc-100 leading-none">
          {toast.message}
        </h4>
        {toast.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
            {toast.description}
          </p>
        )}
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};