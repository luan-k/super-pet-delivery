import LoginForm from "./form";

export default function LoginPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-lg'>Hello world</h1>
      <LoginForm />
    </main>
  );
}
