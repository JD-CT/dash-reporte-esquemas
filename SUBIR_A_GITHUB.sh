#!/bin/bash

echo "🚀 Script para subir el código a GitHub"
echo "========================================"
echo ""
echo "📦 Repositorio: https://github.com/JD-CT/dash-reporte-esquemas"
echo ""

cd /home/ubuntu/dashboard_cumplimiento/nextjs_space

# Verificar si hay cambios
git status

echo ""
echo "Presiona ENTER para continuar con el push..."
read

# Hacer push
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Código subido exitosamente!"
    echo "🔗 Ver repositorio: https://github.com/JD-CT/dash-reporte-esquemas"
else
    echo ""
    echo "❌ Hubo un error. Verifica tu autenticación con GitHub."
    echo ""
    echo "💡 Opciones:"
    echo "1. Usa un Personal Access Token como contraseña"
    echo "2. Configura SSH keys"
    echo "3. Usa GitHub CLI (gh)"
fi
