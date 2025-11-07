# Teste simples do webhook
Write-Host "🧪 Teste simples..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/kirvano-webhook" -Method POST -ContentType "application/json" -Body '{"email":"teste@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Yellow
}


