import IsAuthenticated from "../AdminHeader";
import AdminSidebar from "./sidebar";
import UsersList from "./users";
import "../styles/admin/main.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastContainer
        position='bottom-left'
        theme='dark'
        style={{ fontSize: "18px" }}
      />
      <IsAuthenticated />
      <main className='flex min-h-screen flex-col items-center justify-start p-24 wkode-page-admin-main'>
        <AdminSidebar />
        {children}
      </main>
    </>
  );
}
