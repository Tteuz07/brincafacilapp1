# Script PowerShell para Deploy em Produção
# Execute: .\deploy-producao.ps1

Write-Host "🚀 DEPLOY EM PRODUÇÃO - BrincaFácil" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar build
Write-Host "1️⃣ Verificando build..." -ForegroundColor Yellow
if (Test-Path dist) {
    Write-Host "✅ Pasta dist existe" -ForegroundColor Green
} else {
    Write-Host "⚠️ Pasta dist não existe. Fazendo build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro no build! Corrija os erros antes de continuar." -ForegroundColor Red
        exit 1
    }
}

# 2. Verificar variáveis de ambiente
Write-Host ""
Write-Host "2️⃣ Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (Test-Path .env) {
    $envContent = Get-Content .env
    $hasSupabaseUrl = $envContent | Select-String "VITE_SUPABASE_URL"
    $hasSupabaseKey = $envContent | Select-String "VITE_SUPABASE_ANON_KEY"
    
    if ($hasSupabaseUrl -and $hasSupabaseKey) {
        Write-Host "✅ Arquivo .env encontrado com credenciais" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Arquivo .env não tem todas as credenciais necessárias" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Arquivo .env não encontrado" -ForegroundColor Yellow
}

# 3. Status do Git
Write-Host ""
Write-Host "3️⃣ Status do Git:" -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "📝 Arquivos modificados:" -ForegroundColor Cyan
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "✅ Nenhuma alteração pendente" -ForegroundColor Green
}

# 4. Instruções
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Verifique as variáveis de ambiente na Vercel:" -ForegroundColor White
Write-Host "   - Acesse: https://vercel.com" -ForegroundColor Gray
Write-Host "   - Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   - Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Faça commit e push:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Deploy em producao'" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Aguarde o deploy automático na Vercel" -ForegroundColor White
Write-Host ""
Write-Host "4. Teste o site após o deploy" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan

