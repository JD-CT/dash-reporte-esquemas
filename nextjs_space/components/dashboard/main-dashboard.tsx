
'use client';

import { useState, useEffect } from 'react';
import { FilterBar } from './filter-bar';
import { StatsCards } from './stats-cards';
import { ChartGrid } from './chart-grid';
import { DataTable } from './data-table';

interface DashboardStats {
  totalRecords: number;
  dirisStats: { name: string; value: number }[];
  esquemaStats: { name: string; value: number }[];
  tipoStats: { name: string; value: number }[];
  condicionStats: { name: string; value: number }[];
}

interface DashboardRecord {
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
}

export function MainDashboard() {
  const [filters, setFilters] = useState({
    diris: 'all',
    esquema: 'all',
    tipo: 'all'
  });
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setStatsLoading(true);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.diris !== 'all') params.append('diris', filters.diris);
      if (filters.esquema !== 'all') params.append('esquema', filters.esquema);
      if (filters.tipo !== 'all') params.append('tipo', filters.tipo);

      // Fetch stats and records in parallel
      const [statsResponse, recordsResponse] = await Promise.all([
        fetch(`/api/cumplimiento/stats?${params.toString()}`),
        fetch(`/api/cumplimiento?${params.toString()}`)
      ]);

      const [statsData, recordsData] = await Promise.all([
        statsResponse.json(),
        recordsResponse.json()
      ]);

      setStats(statsData);
      setRecords(recordsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setStatsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Dashboard de Cumplimiento Médico</h1>
        <p className="text-blue-100">
          Análisis de casos de no cumplimiento en esquemas médicos por DIRIS
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Stats Cards */}
      <StatsCards 
        stats={stats}
        loading={statsLoading}
      />

      {/* Charts Grid */}
      <ChartGrid 
        stats={stats}
        loading={statsLoading}
      />

      {/* Data Table */}
      <DataTable 
        data={records}
        loading={loading}
      />
    </div>
  );
}
