import React, { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function GenericModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
}: GenericModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn("max-w-2xl min-h-[650px] p-8 sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto bg-white border-slate-100 flex flex-col", className)}>
                <DialogHeader className="flex flex-col items-center justify-center space-y-2 pb-6 border-b border-slate-100/60 mb-2 w-full shrink-0">
                    <DialogTitle className="text-2xl font-extrabold text-slate-800 tracking-tight text-center w-full">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-slate-500 font-medium text-center w-full max-w-md mx-auto">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}