import EditIcon from "../../../public/admin-edit.svg";
import DuplicateIcon from "../../../public/admin-duplicate.svg";
import ReportIcon from "../../../public/admin-report.svg";
import SearchIcon from "../../../public/admin-search.svg";
import DeleteColor from "../../../public/admin-delete-color.svg";
import ReportIconAlt from "../../../public/admin-report-alt.svg";
import ArrowUp from "../../../public/admin-arrow-up.svg";
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
  multipleFunction?: (ids: number[], typeOfPdf: string) => Promise<void>;
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
  checkbox?: CheckboxConfig;
}

export interface CheckboxConfig {
  checkedItems: number[];
  setCheckedItems: (value: number[]) => void;
  handleCheck: (id: number, isChecked: boolean) => void;
  items?: number[];
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

  //helper function
  const toasterFunction = (
    executeFunction: Promise<unknown> | (() => Promise<unknown>)
  ) => {
    toast.promise(executeFunction, {
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
    });
  };
  const createOnClickHandler = (reportType: string) => () => {
    if (
      config.interact &&
      config.interact.report &&
      config.interact.report.multipleFunction &&
      config.checkbox &&
      config.checkbox.checkedItems.length > 0
    ) {
      toasterFunction(
        config.interact.report.multipleFunction(
          config.checkbox.checkedItems,
          reportType
        )
      );
    }
  };

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
            {config.checkbox ? (
              <th className='wk-table__header wk-table__header--checkbox checkbox'>
                <input id='tophead' type='checkbox' className='' />
                <label htmlFor='tophead'>
                  <span></span>
                </label>
              </th>
            ) : (
              ""
            )}
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
                {config.checkbox ? (
                  <td className='wk-table__td wk-table__td--checkbox'>
                    <input
                      type='checkbox'
                      id={`checkbox-${
                        config.checkbox.items && config.checkbox.items[index]
                      }`}
                      checked={config.checkbox.checkedItems.includes(
                        config.checkbox.items ? config.checkbox.items[index] : 0
                      )}
                      onChange={(e) =>
                        config.checkbox &&
                        config.checkbox.items &&
                        config.checkbox.handleCheck(
                          config.checkbox.items[index],
                          e.target.checked
                        )
                      }
                    />
                    <label
                      htmlFor={`checkbox-${
                        config.checkbox.items && config.checkbox.items[index]
                      }`}>
                      <span></span>
                    </label>
                  </td>
                ) : (
                  ""
                )}
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
                              toasterFunction(
                                config.interact.report.eventFunction(
                                  config.interact.report.items[index]
                                )
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

      {config.checkbox ? (
        <div
          className={`wk-table__footer  ${
            config.checkbox.checkedItems.length === 0 ? "!-bottom-44" : ""
          } `}>
          <div className='wk-table__footer-items-quantity'>
            <ArrowUp />
            {config.checkbox.checkedItems.length}
          </div>
          {config.interact && config.interact.report ? (
            <button
              onClick={createOnClickHandler("simple")}
              disabled={config.interact.report.isDocumentLoading}
              className='wk-btn wk-btn--sm wk-btn--default'>
              <ReportIconAlt />
              Gerar Relatório de Vendas
            </button>
          ) : (
            ""
          )}
          {config.interact && config.interact.report ? (
            <button
              onClick={createOnClickHandler("delivery")}
              disabled={config.interact.report.isDocumentLoading}
              className='wk-btn wk-btn--sm wk-btn--default'>
              <ReportIcon />
              Gerar Notas de Entrega
            </button>
          ) : (
            ""
          )}
          {config.interact &&
          config.interact.delete &&
          config.interact.delete.multipleFunction ? (
            <button className='wk-btn wk-btn--sm wk-btn--default'>
              <DeleteColor />
              Excluir selecionados
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
