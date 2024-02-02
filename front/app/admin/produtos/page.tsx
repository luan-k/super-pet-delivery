"use client";
import Link from "next/link";
import ListSales from "./ListSales";
import { CheckedItemsContext } from "./CheckedItemsContext";
import { useState } from "react";
import HistoryArrows from "../components/HistoryArrows";
import WkButton from "../components/WkButton";

export default function Vendas() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper w-full my-7 font-Inter'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='title-wrapper grid grid-cols-2 mt-7'>
          <h1 className='text-5xl font-semibold '>Vendas</h1>
          <div className='wk-btn__wrapper ml-auto gap-6 flex flex-wrap'>
            <Link
              className='wk-btn wk-btn--primary wk-btn--sm'
              href={"/admin/vendas/criar"}>
              Nova Venda
            </Link>

            <Link
              className='wk-btn wk-btn--primary wk-btn--md'
              href={"/admin/vendas/criar"}>
              Nova Venda
            </Link>

            <Link
              className='wk-btn wk-btn--primary wk-btn--lg'
              href={"/admin/vendas/criar"}>
              Nova Venda
            </Link>

            <WkButton disabled className={"wk-btn wk-btn--primary wk-btn--md"}>
              Hello
            </WkButton>
            <WkButton className={"wk-btn wk-btn--primary wk-btn--md"}>
              Hello
            </WkButton>
            <WkButton className={"wk-btn wk-btn--primary-outline wk-btn--md"}>
              Outline
            </WkButton>
            <WkButton
              disabled
              className={"wk-btn wk-btn--primary-outline wk-btn--md"}>
              Outline
            </WkButton>

            <WkButton
              disabled
              className={"wk-btn wk-btn--secondary wk-btn--md"}>
              solid disabled
            </WkButton>
            <WkButton className={"wk-btn wk-btn--secondary wk-btn--md"}>
              solid
            </WkButton>
            <WkButton className={"wk-btn wk-btn--secondary-outline wk-btn--md"}>
              Outline
            </WkButton>
            <WkButton
              disabled
              className={"wk-btn wk-btn--secondary-outline wk-btn--md"}>
              Outline disabled
            </WkButton>

            <WkButton className={"wk-btn wk-btn--md"}>solid</WkButton>

            <WkButton disabled className={"wk-btn wk-btn--default wk-btn--md"}>
              solid disabled
            </WkButton>
            <WkButton className={"wk-btn wk-btn--default wk-btn--md"}>
              solid
            </WkButton>
            <WkButton className={"wk-btn wk-btn--default-outline wk-btn--md"}>
              Outline
            </WkButton>
            <WkButton
              disabled
              className={"wk-btn wk-btn--default-outline wk-btn--md"}>
              Outline disabled
            </WkButton>

            <WkButton
              className={
                "wk-btn wk-btn--default-outline wk-btn--default-outline--colored wk-btn--md"
              }>
              Outline colored
            </WkButton>
          </div>
        </div>
      </div>
      <CheckedItemsContext.Provider value={{ checkedItems, setCheckedItems }}>
        <ListSales className='' />
      </CheckedItemsContext.Provider>
    </>
  );
}
