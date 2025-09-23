# Teste sem token para ver se a função funciona
Write-Host "🧪 Testando sem token..." -ForegroundColor Green

$webhookUrl = "https://brincafacilapp1-dpj0w22ch-mateus-projects-9570cb18.vercel.app/api/simple"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -ContentType "application/json" -Body '{"email":"teste@exemplo.com","status":"compra_aprovada"}'
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

