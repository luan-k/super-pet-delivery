import WkTable, { TableConfig } from "./WkTable";

export interface DashboardWidgetProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  button?: {
    text: string;
    href: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  table: TableConfig;
  widgetLink?: string;
}

export default function DashboardWidget({
  icon,
  title,
  button,
  table,
  widgetLink,
}: DashboardWidgetProps) {
  return (
    <div className=''>
      <h2 className='text-5xl font-semibold'>Widget</h2>
      <WkTable config={table} />
    </div>
  );
}
