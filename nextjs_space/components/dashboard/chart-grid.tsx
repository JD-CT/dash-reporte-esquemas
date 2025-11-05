
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { DashboardStats, TIPO_ESQUEMA_LABELS } from '@/lib/types';

interface ChartGridProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

export function ChartGrid({ stats, loading }: ChartGridProps) {
  const [activeSheet, setActiveSheet] = useState<string>('esquema_vigente');

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show ALL DIRIS without limiting to 10
  const allDiris = stats.dirisStats ?? [];
  const topEsquemas = stats.esquemaStats?.slice(0, 8) ?? [];

  const sheetOptions = [
    { key: 'esquema_vigente', label: 'Esquema Vigente' },
    { key: 'personalizados_18', label: 'Personaliz. 18+' },
    { key: 'personalizados_0a3', label: 'Personaliz. 0-3' },
    { key: 'personalizados_4a17', label: 'Personaliz. 4-17' }
  ];

  const currentSheetData = stats?.dirisStatsBySheet?.[activeSheet] ?? [];

  return (
    <div className="space-y-6">
      {/* DIRIS Breakdown by Sheets */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Casos por DIRIS - Desglose por Hoja
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sheet Selection Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sheetOptions.map((sheet) => (
              <Button
                key={sheet.key}
                variant={activeSheet === sheet.key ? "default" : "outline"}
                onClick={() => setActiveSheet(sheet.key)}
                className={`text-sm ${
                  activeSheet === sheet.key 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-gray-700 hover:text-blue-700 hover:border-blue-300'
                }`}
              >
                {sheet.label}
              </Button>
            ))}
          </div>

          {/* Chart Display */}
          {currentSheetData && currentSheetData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={currentSheetData} margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={10}
                    tickLine={false}
                    label={{ value: 'Casos', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11 }}
                    formatter={(value) => [value, `Casos en ${TIPO_ESQUEMA_LABELS[activeSheet as keyof typeof TIPO_ESQUEMA_LABELS] || activeSheet}`]}
                  />
                  <Bar dataKey="value" fill="#60B5FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600 text-center">
                Total de DIRIS con casos: {currentSheetData?.length ?? 0} | 
                Total de casos: {currentSheetData?.reduce((sum, item) => sum + item.value, 0) ?? 0}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <div className="text-lg font-semibold">Sin datos disponibles</div>
                <div className="text-sm">No hay casos registrados para {TIPO_ESQUEMA_LABELS[activeSheet as keyof typeof TIPO_ESQUEMA_LABELS] || activeSheet}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row - Two charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Top Esquemas Problemáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEsquemas} margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={9}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  fontSize={10}
                  tickLine={false}
                  label={{ value: 'Casos', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value) => [value, 'Casos']}
                />
                <Bar dataKey="value" fill="#72BF78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              Distribución por Tipo de Esquema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.tipoStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.tipoStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend 
                  verticalAlign="top" 
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => TIPO_ESQUEMA_LABELS[value as keyof typeof TIPO_ESQUEMA_LABELS] || value}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
