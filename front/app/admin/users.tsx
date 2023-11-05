/* "use client";
import { useEffect, useState } from "react";

interface User {
  id: number; // Replace 'number' with the actual type of 'id'
  name: string;
  // Add other properties as needed
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const pageId = 1;
  const pageSize = 10;

  // Get the token from local storage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`, // Add the bearer token to the request headers
          };

          const response = await fetch(
            `http://localhost:8080/users?page_id=${pageId}&page_size=${pageSize}`,
            {
              headers,
            }
          );

          if (response.ok) {
            const data: User[] = await response.json(); // Ensure the response data is of type User[]
            setUsers(data);
          } else {
            console.error("Failed to fetch data");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <main className='flex min-h-screen flex-col items-center justify-between p-24'>
        <h1 className='text-lg'>Hello World</h1>
        <div>
          <h2>Users:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
 */
