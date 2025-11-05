import pandas as pd
import json
from pathlib import Path

# Buscar el archivo Excel
excel_paths = [
    '/home/ubuntu/Uploads/Analisis_Esquemas_Condiciones_anom.xlsx',
    '/home/ubuntu/dashboard_cumplimiento/nextjs_space/data/Analisis_Esquemas_Condiciones_anom.xlsx'
]

excel_file = None
for path in excel_paths:
    if Path(path).exists():
        excel_file = path
        break

if not excel_file:
    print("ERROR: No se encontró el archivo Excel")
    exit(1)

print(f"Procesando archivo: {excel_file}")

# Configuración de las hojas
sheets_config = [
    {
        'name': 'esquema_vigente_cumple',
        'skip_rows': 4,
        'cumplimiento_col': 'esquema_vigente_cumple',
        'tipo': 'esquema_vigente'
    },
    {
        'name': 'personalizados_cumple_',
        'skip_rows': 4,
        'cumplimiento_col': 'personalizado_18_cumple',
        'tipo': 'personalizado_18'
    },
    {
        'name': 'personalizados_cumple_1',
        'skip_rows': 4,
        'cumplimiento_col': 'personalizado_0a3_cumple',
        'tipo': 'personalizado_0a3'
    },
    {
        'name': 'personalizados_cumple_2',
        'skip_rows': 4,
        'cumplimiento_col': 'personalizado_4a17_cumple',
        'tipo': 'personalizado_4a17'
    }
]

all_data = []

for config in sheets_config:
    try:
        df = pd.read_excel(excel_file, sheet_name=config['name'], skiprows=config['skip_rows'])
        
        # Filtrar solo casos de NO cumplimiento
        if config['cumplimiento_col'] in df.columns:
            df_no = df[df[config['cumplimiento_col']].str.upper() == 'NO'].copy()
            
            # Agregar tipo de hoja
            df_no['hoja_origen'] = config['tipo']
            
            # Seleccionar columnas importantes
            columns_to_keep = ['dd_nombre', 'esquema_actual', 'condicion_paciente', 
                              'edad_actual', 'tipo_esquema', 'hoja_origen']
            
            for col in columns_to_keep:
                if col not in df_no.columns and col != 'hoja_origen':
                    df_no[col] = 'N/A'
            
            # Convertir a diccionario
            records = df_no[columns_to_keep].to_dict('records')
            all_data.extend(records)
            
            print(f"✓ {config['name']}: {len(records)} casos de NO cumplimiento")
        else:
            print(f"✗ {config['name']}: Columna {config['cumplimiento_col']} no encontrada")
    except Exception as e:
        print(f"✗ Error en {config['name']}: {str(e)}")

# Limpiar datos (convertir NaN a None)
for record in all_data:
    for key, value in record.items():
        if pd.isna(value):
            record[key] = None

# Guardar como JSON
output_file = '/home/ubuntu/dashboard_cumplimiento/html_version/data.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Total de registros procesados: {len(all_data)}")
print(f"✅ Archivo guardado en: {output_file}")

# Generar estadísticas para el dashboard
stats = {
    'total': len(all_data),
    'por_diris': {},
    'por_esquema': {},
    'por_hoja': {}
}

for record in all_data:
    # Contar por DIRIS
    diris = record.get('dd_nombre', 'N/A')
    stats['por_diris'][diris] = stats['por_diris'].get(diris, 0) + 1
    
    # Contar por esquema
    esquema = record.get('esquema_actual', 'N/A')
    stats['por_esquema'][esquema] = stats['por_esquema'].get(esquema, 0) + 1
    
    # Contar por hoja
    hoja = record.get('hoja_origen', 'N/A')
    stats['por_hoja'][hoja] = stats['por_hoja'].get(hoja, 0) + 1

# Guardar estadísticas
stats_file = '/home/ubuntu/dashboard_cumplimiento/html_version/stats.json'
with open(stats_file, 'w', encoding='utf-8') as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print(f"✅ Estadísticas guardadas en: {stats_file}")
