# Teste do webhook no Vercel
Write-Host "🧪 Testando webhook no Vercel..." -ForegroundColor Green

$webhookUrl = "https://brincafacilapp1-hrqc018pn-mateus-projects-9570cb18.vercel.app/api/kirvano-webhook"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -ContentType "application/json" -Body '{"email":"teste-vercel@exemplo.com","status":"compra_aprovada","token":"brincafacil01"}'
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
