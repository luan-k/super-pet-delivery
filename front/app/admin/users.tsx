"use client";
import { useEffect, useState } from "react";

interface User {
  id: number; // Replace 'number' with the actual type of 'id'
  username: string;
  // Add other properties as needed
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const pageId = 1;
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create the headers with the Authorization header only
        const headers = new Headers();
        const token = localStorage.getItem("accessToken");
        headers.append("Authorization", `Bearer ${token}`);

        // Log the headers
        headers.forEach((value, name) => {
          console.log(`Header: ${name}, Value: ${value}`);
        });

        const response = await fetch(
          `http://localhost:8080/users?page_id=${pageId}&page_size=${pageSize}`,
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          }
        );

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          console.log(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <main className='flex min-h-screen flex-col items-center justify-between p-24'>
        <h1 className='text-lg'>Hello bruh</h1>
        <div>
          <h2>Users:</h2>
          <ul>
            {users.length > 0 ? (
              // Render the list of users if there are users in the array
              users.map((user) => <li key={user.id}>{user.username}</li>)
            ) : (
              // Render a message if there are no users in the array
              <p>No users found.</p>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}
