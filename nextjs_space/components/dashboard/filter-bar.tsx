
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FilterOptions, DashboardFilters } from '@/lib/types';

interface FilterBarProps {
  onFiltersChange: (filters: DashboardFilters) => void;
  filters: DashboardFilters;
}

export function FilterBar({ onFiltersChange, filters }: FilterBarProps) {
  const [options, setOptions] = useState<FilterOptions>({
    diris: [],
    esquemas: [],
    tipos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/cumplimiento/filters');
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      diris: 'all',
      esquema: 'all',
      tipo: 'all'
    });
  };

  const hasActiveFilters = filters.diris !== 'all' || filters.esquema !== 'all' || filters.tipo !== 'all';

  const getFilterCount = () => {
    let count = 0;
    if (filters.diris !== 'all') count++;
    if (filters.esquema !== 'all') count++;
    if (filters.tipo !== 'all') count++;
    return count;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Cargando filtros...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Filtros</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {getFilterCount()} activo{getFilterCount() > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">DIRIS</label>
          <Select
            value={filters.diris}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, diris: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar DIRIS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las DIRIS</SelectItem>
              {options.diris?.map((diris) => (
                <SelectItem key={diris} value={diris}>{diris}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Esquema</label>
          <Select
            value={filters.esquema}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, esquema: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar esquema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los esquemas</SelectItem>
              {options.esquemas?.slice(0, 20).map((esquema) => (
                <SelectItem key={esquema} value={esquema}>{esquema}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Esquema</label>
          <Select
            value={filters.tipo}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, tipo: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {options.tipos?.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
