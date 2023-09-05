"use client";
import React, { useEffect, useState } from "react"; // Import useEffect and useState
import UsersCard from "./UsersCard";

export interface Item {
  id: number;
  username: string;
  full_name: string;
  email: string;
  // Add more properties as needed
}

interface ListUsersProps {
  refreshKey: number; // Prop to trigger refresh
  onDelete: () => void; // Prop to trigger refresh
}

export default function ListUsers({ refreshKey, onDelete }: ListUsersProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  let list;

  useEffect(() => {
    // Function to fetch data from the API
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users?page_id=${page}&page_size=9`
        );
        const data = await response.json();
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call the fetch function
  }, [page, refreshKey]); // Include refreshKey in the dependency array

  if (items.length > 0) {
    list = items.map((item) => (
      <UsersCard key={item.id} item={item} onDelete={onDelete} />
    ));
  } else {
    list = <li>No users found</li>;
  }

  console.log(process.env.NEXT_PUBLIC_API_URL);
  return (
    <div className='mt-8 px-12'>
      <h2 className='text-3xl font-semibold'>Users page {page}</h2>
      <ul className='my-12 grid grid-cols-3 gap-12 px-12'>{list}</ul>
      <div className='button-wrapper grid grid-cols-2 gap-12'>
        <button
          className='text-center p-9 bg-cyan-950 rounded-2xl hover:bg-cyan-800 transition-all'
          onClick={() => setPage(Math.max(1, page - 1))}>
          Previous page
        </button>
        <button
          className='text-center p-9 bg-cyan-950 rounded-2xl hover:bg-cyan-800 transition-all'
          onClick={() => setPage(page + 1)}>
          Next page
        </button>
      </div>
    </div>
  );
}
