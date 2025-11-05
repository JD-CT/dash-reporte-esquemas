
'use client';

import { useState, useEffect } from 'react';
import { FilterBar } from './filter-bar';
import { StatsCards } from './stats-cards';
import { ChartGrid } from './chart-grid';
import { DashboardStats, CumplimientoRecord, DashboardFilters } from '@/lib/types';

export function MainDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    diris: 'all',
    esquema: 'all',
    tipo: 'all'
  });
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [records, setRecords] = useState<CumplimientoRecord[]>([]);
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

      // Fetch only stats (removed records fetch since we're removing the data table)
      const statsResponse = await fetch(`/api/cumplimiento/stats?${params.toString()}`);
      const statsData = await statsResponse.json();

      setStats(statsData);
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
        <h1 className="text-2xl font-bold mb-2">Dashboard de Cumplimiento</h1>
        <p className="text-blue-100">
          Análisis de casos de no cumplimiento en esquemas por DIRIS
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
    </div>
  );
}
