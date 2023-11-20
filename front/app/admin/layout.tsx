import IsAuthenticated from "../AdminHeader";
import AdminSidebar from "./sidebar";
import UsersList from "./users";
import "../styles/admin/main.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IsAuthenticated />
      <main className='flex min-h-screen flex-col items-center justify-between p-24 wkode-page-admin-main'>
        <AdminSidebar />
        {children}
      </main>
    </>
  );
}
