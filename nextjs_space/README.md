
# 📊 Dashboard de Cumplimiento Médico

Dashboard interactivo para análisis de cumplimiento de esquemas médicos basado en datos de múltiples DIRIS (Direcciones de Redes Integradas de Salud).

## 🚀 Características

- **Análisis Multihoja**: Procesa y consolida datos de 4 hojas Excel diferentes
- **Visualización Interactiva**: Gráficos dinámicos de barras y pie charts
- **Filtros en Tiempo Real**: Filtra por DIRIS, esquema y tipo
- **Base de Datos PostgreSQL**: Almacenamiento persistente de datos
- **API REST**: Endpoints para consultas programáticas
- **Diseño Responsive**: Funciona en dispositivos móviles, tablets y desktop

## 📋 Requisitos Previos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- Yarn (gestor de paquetes)
- Python 3.x (para procesamiento de Excel)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio-url>
cd dashboard_cumplimiento/nextjs_space
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Instalar dependencias de Python

```bash
pip install pandas openpyxl
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cumplimiento_db"

# Configuración de Next.js
NODE_ENV=development
```

### 5. Configurar la base de datos

```bash
# Generar el cliente Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate dev

# Poblar la base de datos con datos del Excel
yarn prisma db seed
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

### Modo Producción

```bash
# Construir la aplicación
yarn build

# Iniciar servidor de producción
yarn start
```

## 📁 Estructura del Proyecto

```
nextjs_space/
├── app/                      # Páginas y rutas de Next.js
│   ├── api/                 # Endpoints de la API REST
│   │   └── cumplimiento/    # API de datos de cumplimiento
│   ├── diris/               # Página de análisis por DIRIS
│   ├── esquemas/            # Página de análisis por esquemas
│   ├── criticos/            # Página de casos críticos
│   ├── datos/               # Página de datos completos
│   ├── reportes/            # Página de reportes
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página de inicio (dashboard)
├── components/              # Componentes React
│   ├── dashboard/           # Componentes del dashboard
│   │   ├── chart-grid.tsx   # Grid de gráficos
│   │   ├── data-table.tsx   # Tabla de datos
│   │   ├── filter-bar.tsx   # Barra de filtros
│   │   ├── main-dashboard.tsx # Dashboard principal
│   │   └── stats-cards.tsx  # Tarjetas de estadísticas
│   └── ui/                  # Componentes UI reutilizables
├── lib/                     # Utilidades y configuración
│   ├── db.ts               # Cliente de Prisma
│   ├── types.ts            # Tipos TypeScript
│   └── utils.ts            # Funciones auxiliares
├── prisma/                  # Configuración de base de datos
│   └── schema.prisma       # Esquema de la base de datos
├── scripts/                 # Scripts de procesamiento
│   ├── process_excel.py    # Procesador de archivos Excel
│   └── seed.ts             # Script de población de datos
├── data/                    # Archivos de datos
│   └── Analisis_Esquemas_Condiciones_anom.xlsx
└── public/                  # Archivos estáticos
```

## 🗃️ Estructura de la Base de Datos

### Tabla: `CumplimientoRecord`

```prisma
model CumplimientoRecord {
  id                  Int       @id @default(autoincrement())
  hoja_origen        String    // Hoja de origen del Excel
  dd_nombre          String    // Nombre de la DIRIS
  esquema_actual     String    // Esquema médico actual
  condicion_paciente String?   // Condición del paciente
  edad_actual        Int?      // Edad del paciente
  tipo_esquema       String?   // Tipo de esquema
  cumplimiento       String    // Estado de cumplimiento (SI/NO)
  // ... otros campos
  createdAt          DateTime  @default(now())
}
```

## 🔌 API Endpoints

### GET `/api/cumplimiento`
Obtiene todos los registros de cumplimiento con filtros opcionales.

**Query Parameters:**
- `diris` - Filtrar por DIRIS específica
- `esquema` - Filtrar por tipo de esquema
- `tipo` - Filtrar por tipo de hoja

**Ejemplo:**
```bash
curl "http://localhost:3000/api/cumplimiento?diris=DIRIS+LIMA+SUR"
```

### GET `/api/cumplimiento/stats`
Obtiene estadísticas agregadas de cumplimiento.

**Response:**
```json
{
  "totalCasos": 3179,
  "totalDiris": 8,
  "esquemasMasAfectados": [...],
  "casosPorDiris": [...]
}
```

### GET `/api/cumplimiento/filters`
Obtiene listas de valores únicos para filtros.

**Response:**
```json
{
  "diris": ["DIRIS LIMA SUR", ...],
  "esquemas": ["personalizado_18", ...],
  "tipos": ["esquema_vigente", ...]
}
```

## 📊 Fuente de Datos

El dashboard procesa datos del archivo Excel `Analisis_Esquemas_Condiciones_anom.xlsx` que contiene 4 hojas:

1. **Esquema Vigente** (esquema_vigente_cumple)
2. **Personalizados 18+** (personalizado_18)
3. **Personalizados 0-3** (personalizado_0a3)
4. **Personalizados 4-17** (personalizado_4a17)

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Gráficos**: Recharts
- **Base de Datos**: PostgreSQL, Prisma ORM
- **Procesamiento**: Python, pandas

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Autor

Dashboard desarrollado para análisis de cumplimiento médico de DIRIS.

## 🔗 Links Útiles

- **Aplicación desplegada**: https://dashboard-cumplimien-c0qn8z.abacusai.app
- **Documentación de Next.js**: https://nextjs.org/docs
- **Documentación de Prisma**: https://www.prisma.io/docs
