"use client";
import Link from "next/link";
import ListSales from "./ListSales";
import { CheckedSalesContext } from "./CheckedSalesContext";
import { useState } from "react";
import HistoryArrows from "../components/HistoryArrows";

export default function Vendas() {
  const [checkedSales, setCheckedSales] = useState<number[]>([]);
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper w-full my-7 font-Inter'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='title-wrapper grid grid-cols-2 mt-7'>
          <h1 className='text-5xl font-semibold '>Vendas</h1>
          <div className='wk-btn__wrapper ml-auto'>
            <Link
              className='wk-btn wk-btn--blue wk-btn--bg text-2xl'
              href={"/admin/vendas/criar"}>
              Nova Venda
            </Link>
          </div>
        </div>
      </div>
      <CheckedSalesContext.Provider value={{ checkedSales, setCheckedSales }}>
        <ListSales className='' />
      </CheckedSalesContext.Provider>
    </>
  );
}
