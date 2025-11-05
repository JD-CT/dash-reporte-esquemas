
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ChartGridProps {
  stats: {
    totalRecords: number;
    dirisStats: { name: string; value: number }[];
    esquemaStats: { name: string; value: number }[];
    tipoStats: { name: string; value: number }[];
    condicionStats: { name: string; value: number }[];
  } | null;
  loading: boolean;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

export function ChartGrid({ stats, loading }: ChartGridProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
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
    );
  }

  const topDiris = stats.dirisStats?.slice(0, 10) ?? [];
  const topEsquemas = stats.esquemaStats?.slice(0, 8) ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Casos por DIRIS (Top 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDiris} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
                tickLine={false}
                interval="preserveStartEnd"
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
              <Bar dataKey="value" fill="#60B5FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                formatter={(value) => value.replace(/personalizados_orden_/, 'Personal. ')}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            Distribución por Condición de Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.condicionStats}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.condicionStats?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
