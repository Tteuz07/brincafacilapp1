# Teste do webhook no ngrok
Write-Host "🧪 Testando webhook no ngrok..." -ForegroundColor Green

$webhookUrl = "https://reserved-abe-unspiriting.ngrok-free.dev/api/kirvano-webhook"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -ContentType "application/json" -Body '{"email":"teste-ngrok@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    }
}


