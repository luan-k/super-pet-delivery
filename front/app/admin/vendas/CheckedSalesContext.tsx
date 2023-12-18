import React, { Dispatch, SetStateAction } from "react";

interface CheckedSalesContextProps {
  checkedSales: number[];
  setCheckedSales: Dispatch<SetStateAction<number[]>>;
}

export const CheckedSalesContext =
  React.createContext<CheckedSalesContextProps>({
    checkedSales: [],
    setCheckedSales: () => {},
  });
