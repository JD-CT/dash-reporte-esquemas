
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Database, 
  FileText, 
  TrendingUp,
  Activity,
  Users,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Resumen General',
    href: '/',
    icon: BarChart3,
    description: 'Vista general del cumplimiento'
  },
  {
    title: 'Por DIRIS',
    href: '/diris',
    icon: Users,
    description: 'Análisis por DIRIS'
  },
  {
    title: 'Por Esquemas',
    href: '/esquemas',
    icon: Activity,
    description: 'Análisis por esquemas médicos'
  },
  {
    title: 'Casos Críticos',
    href: '/criticos',
    icon: AlertTriangle,
    description: 'Casos de mayor impacto'
  },
  {
    title: 'Datos Detallados',
    href: '/datos',
    icon: Database,
    description: 'Tabla completa de datos'
  },
  {
    title: 'Reportes',
    href: '/reportes',
    icon: FileText,
    description: 'Generar reportes'
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      'flex flex-col w-64 bg-gradient-to-b from-blue-50 to-indigo-100 border-r border-blue-200 h-screen sticky top-0',
      className
    )}>
      <div className="flex items-center gap-2 p-6 border-b border-blue-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-lg">Cumplimiento</h1>
          <p className="text-xs text-gray-600">Dashboard Médico</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                'hover:bg-white/60 hover:shadow-sm',
                isActive 
                  ? 'bg-white shadow-md border border-blue-200 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-700'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
              )} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 truncate">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">3,179</div>
          <div className="text-xs text-gray-600">Casos de No Cumplimiento</div>
        </div>
      </div>
    </div>
  );
}
