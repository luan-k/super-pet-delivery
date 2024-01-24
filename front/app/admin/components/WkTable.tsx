export interface TableColumn {
  title: string;
  key: string;
  sortable: boolean;
  width: number;
  styles?: string;
  items: any[];
}

export interface TableConfig {
  columns: TableColumn[];
}

interface ListItemsResponse {
  totalNumberOfItems: number;
  config: TableConfig;
}

export default function WkTable({
  totalNumberOfItems,
  config,
}: ListItemsResponse) {
  console.log("this is the data");
  console.log(config);
  console.log("this is the total");
  console.log(totalNumberOfItems);
  return (
    <table className=''>
      <tbody>
        <tr className=''>
          <th className=''>
            <input type='checkbox' className='' />
          </th>
          {config.columns.map((column) => (
            <th
              key={column.key}
              className={`list-clients__client-${column.key} ${
                column.sortable ? "cursor-pointer" : ""
              }`}
              style={{ width: `${column.width}%` }}>
              {column.title}
            </th>
          ))}
          <th className=''></th>
        </tr>

        {config.columns[0].items.map((item, index) => (
          <tr
            key={index}
            className={`list-clients__client-row list-clients--${
              index % 2 === 0 ? "even" : "odd"
            }`}>
            <td className=''>
              <input type='checkbox' className='' />
            </td>
            {config.columns.map((column) => (
              <td
                key={column.key}
                className={`list-clients__client-${column.key} ${
                  column.styles || ""
                }`}>
                {column.items[index]}
              </td>
            ))}
            <td className=''>
              <a className='' href={`/admin/vendas/${index + 1}`}>
                Editar
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
