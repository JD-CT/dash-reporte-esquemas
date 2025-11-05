
import pandas as pd
import json
import sys
import os

def process_excel_file():
    """Process the Excel file and extract non-compliance records."""
    
    # Path to Excel file
    excel_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'Analisis_Esquemas_Condiciones_anom.xlsx')
    
    all_records = []
    
    # Configuration for each sheet
    sheet_configs = [
        {
            'name': 'esquema_vigente',
            'skip_rows': 11,
            'compliance_col': 'esquema_vigente',
            'tipo_esquema': 'esquema_vigente'
        },
        {
            'name': 'personalizados_cumple_',
            'skip_rows': 8,
            'compliance_col': 'personalizados_cumple_orden_18',
            'tipo_esquema': 'personalizados_18'
        },
        {
            'name': 'personalizados_cumple_1',
            'skip_rows': 8,
            'compliance_col': 'personalizados_cumple_orden_niños_0a3',
            'tipo_esquema': 'personalizados_0a3'
        },
        {
            'name': 'personalizados_cumple_2',
            'skip_rows': 8,
            'compliance_col': 'personalizados_cumple_orden_niños_4a17',
            'tipo_esquema': 'personalizados_4a17'
        }
    ]
    
    for config in sheet_configs:
        try:
            # Read sheet
            df = pd.read_excel(excel_file, sheet_name=config['name'], skiprows=config['skip_rows'])
            
            # Clean column names and ensure we have required columns
            df.columns = df.columns.str.strip()
            
            # Filter for non-compliance cases only (cumplimiento = "NO")
            if config['compliance_col'] in df.columns:
                non_compliant = df[df[config['compliance_col']] == 'NO'].copy()
                
                if not non_compliant.empty:
                    # Prepare records for database
                    for _, row in non_compliant.iterrows():
                        record = {
                            'dd_nombre': str(row.get('dd_nombre', '')).strip(),
                            'ee_nombre': str(row.get('ee_nombre', '')).strip(),
                            'esquema_actual': str(row.get('esquema_actual', '')).strip(),
                            'año_esquema_actual': int(row.get('año_esquema_actual', 2025)),
                            'segmento': str(row.get('segmento', '')).strip() if 'segmento' in row and pd.notna(row.get('segmento')) else None,
                            'paciente_id': str(row.get('paciente_id', '')).strip(),
                            'condicion': str(row.get('condicion', '')).strip(),
                            'cumplimiento': 'NO',  # All filtered records are non-compliant
                            'tipo_esquema': config['tipo_esquema']
                        }
                        
                        # Validate required fields are not empty
                        if record['dd_nombre'] and record['ee_nombre'] and record['esquema_actual'] and record['paciente_id']:
                            all_records.append(record)
                
                print(f"Processed {config['name']}: {len(non_compliant)} non-compliance records found", file=sys.stderr)
            else:
                print(f"Warning: Compliance column '{config['compliance_col']}' not found in sheet {config['name']}", file=sys.stderr)
                
        except Exception as e:
            print(f"Error processing sheet {config['name']}: {str(e)}", file=sys.stderr)
            continue
    
    print(f"Total non-compliance records found: {len(all_records)}", file=sys.stderr)
    return all_records

if __name__ == "__main__":
    try:
        records = process_excel_file()
        # Output JSON to stdout for Node.js to read
        print(json.dumps(records))
    except Exception as e:
        print(f"Fatal error: {str(e)}", file=sys.stderr)
        sys.exit(1)
