export type MenuItem = {
  title?: string;
  root?: boolean;
  icon?: string;
  page?: string;
  badge?: object;
  bullet?: string;
  module?: string;
  prod?: boolean;
  alignment?: string;
  rules?: number | boolean;
  submenu?: MenuItem[];
  img?: string;
  width?: string;
  showIf?: (userData: string, customRole: string) => void;
};
