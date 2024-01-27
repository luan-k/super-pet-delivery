import EditIcon from "../../../public/admin-edit.svg";
import DuplicateIcon from "../../../public/admin-duplicate.svg";
import DeleteIcon from "../../../public/admin-delete.svg";
import ReportIcon from "../../../public/admin-report.svg";
import Link from "next/link";
import { FormEvent } from "react";

export interface TableColumn {
  title: string;
  key: string;
  sortable: boolean;
  width: number;
  styles?: string;
  items: any[];
}

export interface InteractConfig {
  edit?: boolean | string[];
  duplicate?: boolean;
  delete?: deleteConfig;
  report?: boolean;
}

export interface deleteConfig {
  eventFunction: (e: FormEvent, id: number) => void;
  items: number[];
}

export interface TableConfig {
  topClasses?: string;
  columns: TableColumn[];
  interact?: InteractConfig;
}

interface ListItemsResponse {
  totalNumberOfItems: number;
  config: TableConfig;
  className?: string;
}

export default function WkTable({
  totalNumberOfItems,
  config,
  className,
}: ListItemsResponse) {
  console.log("this is the data");
  console.log(config);
  console.log("this is the total");
  console.log(totalNumberOfItems);
  return (
    <table className={`wk-table ${className || ""} ${config.topClasses || ""}`}>
      <tbody>
        <tr className='wk-table__header-row'>
          <th className='wk-table__header wk-table__header--checkbox checkbox'>
            <input id='tophead' type='checkbox' className='' />
            <label htmlFor='tophead'>
              <span></span>
            </label>
          </th>
          {config.columns.map((column) => (
            <th
              key={column.key}
              className={`wk-table__header wk-table__header--${column.key} ${
                column.sortable ? "cursor-pointer" : ""
              }`}
              style={{ width: `${column.width}%` }}>
              {column.title}
            </th>
          ))}
          {config.interact ? (
            <th className='wk-table__header wk-table__header--interact'></th>
          ) : (
            ""
          )}
        </tr>

        {config.columns[0].items.map((item, index) => (
          <tr
            key={index}
            className={`wk-table__row wk-table__row--${
              index % 2 === 0 ? "even" : "odd"
            }`}>
            <td className='wk-table__td wk-table__td--checkbox'>
              <input type='checkbox' id={`checkbox-${index}`} />
              <label htmlFor={`checkbox-${index}`}>
                <span></span>
              </label>
            </td>
            {config.columns.map((column) => (
              <td
                key={column.key}
                className={`wk-table__td wk-table__td--${column.key} ${
                  column.styles || ""
                }`}>
                {column.items[index]}
              </td>
            ))}
            {config.interact ? (
              <td className='wk-table__td wk-table__td--interact'>
                <div className='wk-table__td--interact__wrapper'>
                  {config.interact.report ? (
                    <a className=''>
                      <ReportIcon />
                    </a>
                  ) : (
                    ""
                  )}
                  {config.interact.edit ? (
                    Array.isArray(config.interact.edit) ? (
                      <Link href={config.interact.edit[index]}>
                        <EditIcon />
                      </Link>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  {config.interact.duplicate ? (
                    <a className=''>
                      <DuplicateIcon />
                    </a>
                  ) : (
                    ""
                  )}
                  {config.interact && config.interact.delete ? (
                    <button
                      onClick={(e) =>
                        config.interact &&
                        config.interact.delete &&
                        config.interact.delete.eventFunction(
                          e,
                          config.interact.delete.items[index]
                        )
                      }>
                      <DeleteIcon />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            ) : (
              ""
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
