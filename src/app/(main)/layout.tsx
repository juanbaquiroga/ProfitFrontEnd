import { Sidebar } from "@/components/layout/sidebar";
import { ToastStack } from "@/components/shared/toast/ToastStack";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <ToastStack />
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}