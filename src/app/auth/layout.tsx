export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans">
            <h2 className="text-6xl font-bold mb-16">Profit</h2>
            {children}
        </div>
    );
}