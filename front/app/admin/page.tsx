import IsAuthenticated from "../IsAuthenticated";
import UsersList from "./users";

export default function Admin() {
  return (
    <>
      <IsAuthenticated />
      <UsersList />
      <main className='flex min-h-screen flex-col items-center justify-between p-24'>
        <h1 className='text-lg'>Fck</h1>
      </main>
    </>
  );
}
