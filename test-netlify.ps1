# test-netlify.ps1
# Teste do webhook Netlify

$url = "https://seu-app.netlify.app/.netlify/functions/kirvano-webhook"
$token = "brincafacil01"

$body = @{
    email = "teste-netlify@exemplo.com"
    status = "compra_aprovada"
    token = $token
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

Write-Host "🧪 Testando webhook Netlify..."
Write-Host "URL: $url"
Write-Host "Token: $token"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -Headers $headers -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "📝 Response: $($response.Content)"
    
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📝 Response: $responseBody"
    }
}

