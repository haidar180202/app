export interface ModuleInfo {
  name: string;
  slug: string;
  overide_slug?: string;
  slug_public?: string;
  icon: string;
  m_icon: string;
  color?: string;
  category: string;
  status?: "prod" | "dev" | boolean;
  ahref?: boolean;
  sso?: boolean;
  rules?: number;
}
