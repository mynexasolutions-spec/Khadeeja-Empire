import "@/styles/admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-scope" data-admin-scope>
      {children}
    </div>
  );
}
