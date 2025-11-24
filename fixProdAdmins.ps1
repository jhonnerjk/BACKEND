# Script para actualizar admins en producción
# Copia tu MONGO_URI de Render aquí:
$env:MONGO_URI = "TU_MONGO_URI_DE_PRODUCCION_AQUI"

Write-Host "Ejecutando migración en BD de producción..." -ForegroundColor Yellow
node src/fixAdmins.js

Write-Host "`nPresiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
