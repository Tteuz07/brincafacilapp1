# Teste do webhook usando PowerShell
Write-Host "🧪 Testando webhook local..." -ForegroundColor Green
Write-Host ""

# Teste 1: Sem token (deve falhar)
Write-Host "1️⃣ Teste sem token:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/kirvano-webhook" -Method POST -ContentType "application/json" -Body '{"email":"teste@exemplo.com","status":"compra_aprovada"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: Com token no body (deve funcionar)
Write-Host "2️⃣ Teste com token no body:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/kirvano-webhook" -Method POST -ContentType "application/json" -Body '{"email":"teste@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 3: Com token no header (deve funcionar)
Write-Host "3️⃣ Teste com token no header:" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer brincafacil01"
    }
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/kirvano-webhook" -Method POST -Headers $headers -Body '{"email":"teste@exemplo.com","status":"compra_aprovada"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 4: Rota de teste simples
Write-Host "4️⃣ Teste da rota de teste:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/test-webhook" -Method POST -ContentType "application/json" -Body '{"email":"teste@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}


