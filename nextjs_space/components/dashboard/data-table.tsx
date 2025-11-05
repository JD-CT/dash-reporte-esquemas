
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: Array<{
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
  }>;
  loading: boolean;
}

const ROWS_PER_PAGE = 25;

export function DataTable({ data, loading }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(row => 
      row.dd_nombre?.toLowerCase().includes(term) ||
      row.ee_nombre?.toLowerCase().includes(term) ||
      row.esquema_actual?.toLowerCase().includes(term) ||
      row.condicion?.toLowerCase().includes(term) ||
      row.paciente_id?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const exportToCSV = () => {
    const headers = ['DIRIS', 'Establecimiento', 'Esquema Actual', 'Año', 'Segmento', 'Paciente ID', 'Condición', 'Tipo Esquema'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.dd_nombre,
        `"${row.ee_nombre}"`,
        row.esquema_actual,
        row.año_esquema_actual,
        row.segmento || '',
        row.paciente_id,
        row.condicion,
        row.tipo_esquema
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cumplimiento_datos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Eye className="w-5 h-5 text-blue-600" />
            Datos Detallados ({filteredData.length.toLocaleString()} registros)
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por DIRIS, establecimiento, esquema, condición o ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No se encontraron registros que coincidan con la búsqueda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">DIRIS</th>
                    <th className="text-left p-3 font-medium text-gray-700">Establecimiento</th>
                    <th className="text-left p-3 font-medium text-gray-700">Esquema</th>
                    <th className="text-left p-3 font-medium text-gray-700">Año</th>
                    <th className="text-left p-3 font-medium text-gray-700">Segmento</th>
                    <th className="text-left p-3 font-medium text-gray-700">Condición</th>
                    <th className="text-left p-3 font-medium text-gray-700">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="p-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {row.dd_nombre}
                        </Badge>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="truncate" title={row.ee_nombre}>
                          {row.ee_nombre}
                        </div>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="truncate font-mono text-xs" title={row.esquema_actual}>
                          {row.esquema_actual}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{row.año_esquema_actual}</td>
                      <td className="p-3">
                        {row.segmento && (
                          <Badge variant="secondary" className="text-xs">
                            {row.segmento}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={row.condicion === 'CONTINUADOR' ? 'default' : 
                                   row.condicion === 'NUEVO' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {row.condicion}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        {row.tipo_esquema.replace(/personalizados_orden_/, 'P. ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
