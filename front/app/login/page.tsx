import LoginForm from "./form";
import "../styles/login/main.scss";
import "../styles/components/main.scss";
import Image from "next/image";
import LogoImage from "../../public/static/images/superpet.png";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  return (
    <main className='wkode-login-form flex min-h-screen flex-col items-center justify-center p-24'>
      <ToastContainer
        position='bottom-left'
        theme='dark'
        style={{ fontSize: "18px" }}
      />
      <Image
        src={LogoImage}
        width={250}
        height={250}
        alt='Logo da empresa Superpet'
        className='mb-9'
      />
      <LoginForm />
    </main>
  );
}
