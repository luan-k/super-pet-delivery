import EditIcon from "../../../public/admin-edit.svg";
import DuplicateIcon from "../../../public/admin-duplicate.svg";
import DeleteIcon from "../../../public/admin-delete.svg";
import ReportIcon from "../../../public/admin-report.svg";
import SearchIcon from "../../../public/admin-search.svg";
import Link from "next/link";
import { FormEvent } from "react";
import ModalAreYouSure from "./ModalAreYouSure";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import WkPagination from "./WkPagination";
import { toast } from "react-toastify";

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
  delete?: buttonConfig;
  report?: reportButtonConfig;
}

export interface buttonConfig {
  eventFunction: (id: number) => Promise<void>;
  items: number[];
}

export interface reportButtonConfig extends buttonConfig {
  isDocumentLoading: boolean;
}

export interface PagesConfig {
  currentPage: {
    value: number;
    setter: (value: number) => void;
  };
  salesPerPage: number;
}

export interface TableConfig {
  topClasses?: string;
  columns: TableColumn[];
  interact?: InteractConfig;
  totalNumberOfItems: number;
  pages?: PagesConfig;
  sortInfo?: SortInfo;
  searchBar?: SearchBarConfig;
}

export interface SearchBarConfig {
  search: string;
  setSearch: (value: string) => void;
  placeholder?: string;
}
export interface SortInfo {
  field: string | null;
  direction: string | null;
  handleSort: (field: string) => void;
}

interface ListItemsResponse {
  config: TableConfig;
  className?: string;
}

export default function WkTable({ config, className }: ListItemsResponse) {
  console.log("this is the data");
  console.log(config);
  console.log("this is the total");
  console.log(config.totalNumberOfItems);

  return (
    <>
      {config.searchBar ? (
        <div className='wk-table__search-bar--wrapper'>
          <SearchIcon className='wk-table__search-bar--icon' />
          <input
            className='wk-table__search-bar'
            type='text'
            id='search'
            value={config.searchBar.search}
            onChange={(e) =>
              config.searchBar && config.searchBar.setSearch(e.target.value)
            }
            placeholder={`${config.searchBar.placeholder || "Pesquisar..."}`}
          />
        </div>
      ) : (
        ""
      )}
      <table
        className={`wk-table ${className || ""} ${config.topClasses || ""}`}>
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
                  column.sortable
                    ? "cursor-pointer wk-table__header--sortable"
                    : ""
                }`}
                onClick={() =>
                  column.sortable &&
                  config.sortInfo &&
                  config.sortInfo.handleSort(column.key)
                }
                style={{ width: `${column.width}%` }}>
                <div className='wk-table__header--wrapper'>
                  {column.title}
                  {column.sortable ? (
                    <span className={`wk-table__header--sortable `}>
                      <BiSolidUpArrow
                        className={`wk-table__header--sortable--up ${
                          config.sortInfo?.field === column.key &&
                          (config.sortInfo?.direction === "asc"
                            ? "wk-table__header--sortable--up--active"
                            : "")
                        } }`}
                      />
                      <BiSolidDownArrow
                        className={`wk-table__header--sortable--down ${
                          config.sortInfo?.field === column.key &&
                          (config.sortInfo?.direction === "desc"
                            ? "wk-table__header--sortable--down--active"
                            : "")
                        } }
                        }`}
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </th>
            ))}
            {config.interact ? (
              <th className='wk-table__header wk-table__header--interact'></th>
            ) : (
              ""
            )}
          </tr>

          {config.columns[0].items.length > 0 ? (
            config.columns[0].items.map((item, index) => (
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
                      {config.interact && config.interact.report ? (
                        <button
                          className='wk-table__td--interact__report-button'
                          onClick={() => {
                            config.interact &&
                              config.interact.report &&
                              toast.promise(
                                config.interact.report.eventFunction(
                                  config.interact.report.items[index]
                                ),
                                {
                                  pending: {
                                    render: "Carregando documento...",
                                    type: toast.TYPE.INFO,
                                  },
                                  success: {
                                    render: "Documento carregado com sucesso!",
                                    type: toast.TYPE.SUCCESS,
                                  },
                                  error: {
                                    render: "Erro ao carregar documento.",
                                    type: toast.TYPE.ERROR,
                                  },
                                }
                              );
                          }}
                          disabled={config.interact.report.isDocumentLoading}>
                          <ReportIcon />
                        </button>
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
                        <ModalAreYouSure
                          deleteFunction={config.interact.delete.eventFunction}
                          deleteIndex={config.interact.delete.items[index]}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={config.columns.length + 1} className='wk-table__td'>
                Nenhum resultado encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {config.pages ? (
        <WkPagination
          totalNumberOfItems={config.totalNumberOfItems}
          pages={config.pages}
          maxButtonsToShow={7}
        />
      ) : (
        ""
      )}
    </>
  );
}
