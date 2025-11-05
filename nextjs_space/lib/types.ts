export interface CumplimientoRecord {
  id: string;
  dd_nombre: string;
  ee_nombre: string;
  esquema_actual: string;
  año_esquema_actual: number;
  segmento: string | null;
  paciente_id: string;
  condicion: string;
  cumplimiento: string;
  tipo_esquema: string;
  created_at: Date;
}

export interface DashboardStats {
  totalRecords: number;
  dirisStats: { name: string; value: number; tipo_esquema?: string }[];
  dirisStatsBySheet: {
    [sheet: string]: { name: string; value: number }[];
  };
  esquemaStats: { name: string; value: number }[];
  tipoStats: { name: string; value: number }[];
  condicionStats: { name: string; value: number }[];
}

export interface FilterOptions {
  diris: string[];
  esquemas: string[];
  tipos: string[];
}

export interface DashboardFilters {
  diris: string;
  esquema: string;
  tipo: string;
}

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
}

export const TIPO_ESQUEMA_LABELS = {
  'esquema_vigente': 'Esquema Vigente',
  'personalizados_18': 'Personalizados 18+',
  'personalizados_0a3': 'Personalizados 0-3',
  'personalizados_4a17': 'Personalizados 4-17'
} as const;