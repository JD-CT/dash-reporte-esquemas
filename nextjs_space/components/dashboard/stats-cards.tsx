
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/lib/types';

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalDiris = stats.dirisStats?.length ?? 0;
  const totalEsquemas = stats.esquemaStats?.length ?? 0;
  const topDiris = stats.dirisStats?.[0];
  const topEsquema = stats.esquemaStats?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Total Casos
          </CardTitle>
          <div className="text-2xl font-bold text-red-600">
            {stats.totalRecords?.toLocaleString() ?? 0}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            Casos de no cumplimiento registrados
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            DIRIS Afectadas
          </CardTitle>
          <div className="text-2xl font-bold text-blue-600">
            {totalDiris}
          </div>
        </CardHeader>
        <CardContent>
          {topDiris && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mayor afectación:</p>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                {topDiris.name}: {topDiris.value} casos
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            Esquemas Afectados
          </CardTitle>
          <div className="text-2xl font-bold text-green-600">
            {totalEsquemas}
          </div>
        </CardHeader>
        <CardContent>
          {topEsquema && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Más problemático:</p>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {topEsquema.value} casos
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Tipos Esquemas
          </CardTitle>
          <div className="text-2xl font-bold text-purple-600">
            {stats.tipoStats?.length ?? 0}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Distribución de tipos</p>
            <div className="flex flex-wrap gap-1">
              {stats.tipoStats?.slice(0, 2).map((tipo) => (
                <Badge key={tipo.name} variant="outline" className="text-xs">
                  {tipo.value}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
