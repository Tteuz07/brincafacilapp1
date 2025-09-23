# Teste da função simples no Vercel
Write-Host "🧪 Testando função simples no Vercel..." -ForegroundColor Green

$webhookUrl = "https://brincafacilapp1-dpj0w22ch-mateus-projects-9570cb18.vercel.app/api/simple"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -ContentType "application/json" -Body '{"email":"teste-simple@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
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

