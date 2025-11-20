# Script PowerShell para Deploy em Produção
# Execute: .\deploy-producao-agora.ps1

Write-Host "🚀 DEPLOY EM PRODUÇÃO - BrincaFácil" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$projectPath = "D:\App em contrução\brincafacilapp1- Pronto\brincafacilapp1"
Write-Host "📁 Navegando para: $projectPath" -ForegroundColor Yellow

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✅ Diretório encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Diretório não encontrado: $projectPath" -ForegroundColor Red
    Write-Host "⚠️ Por favor, navegue manualmente para o diretório do projeto" -ForegroundColor Yellow
    exit 1
}

# 1. Verificar build
Write-Host ""
Write-Host "1️⃣ Testando build local..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Corrija os erros antes de continuar." -ForegroundColor Red
    Write-Host "⚠️ Você ainda pode fazer deploy, mas é recomendado corrigir os erros primeiro." -ForegroundColor Yellow
    $continuar = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continuar -ne "s") {
        exit 1
    }
} else {
    Write-Host "✅ Build local funcionou!" -ForegroundColor Green
}

# 2. Verificar Git
Write-Host ""
Write-Host "2️⃣ Verificando status do Git..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "📝 Arquivos modificados:" -ForegroundColor Cyan
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    Write-Host ""
    $fazerCommit = Read-Host "Deseja fazer commit e push? (s/n)"
    if ($fazerCommit -eq "s") {
        git add .
        $mensagem = Read-Host "Digite a mensagem do commit (ou pressione Enter para usar padrão)"
        if ([string]::IsNullOrWhiteSpace($mensagem)) {
            $mensagem = "Deploy em produção - melhorias de persistência de login"
        }
        git commit -m $mensagem
        git push
        Write-Host "✅ Commit e push realizados!" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Nenhuma alteração pendente" -ForegroundColor Green
}

# 3. Verificar Vercel CLI
Write-Host ""
Write-Host "3️⃣ Verificando Vercel CLI..." -ForegroundColor Yellow
$vercelVersion = vercel --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Vercel CLI instalada: $vercelVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Vercel CLI não encontrada" -ForegroundColor Red
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 4. Opções de Deploy
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 OPÇÕES DE DEPLOY:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Deploy via Git (Recomendado)" -ForegroundColor Yellow
Write-Host "   - Faça commit e push" -ForegroundColor Gray
Write-Host "   - A Vercel fará deploy automático" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy via Vercel CLI" -ForegroundColor Yellow
Write-Host "   - Execute: vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy via Dashboard Vercel" -ForegroundColor Yellow
Write-Host "   - Acesse: https://vercel.com" -ForegroundColor Gray
Write-Host "   - Conecte o repositório" -ForegroundColor Gray
Write-Host ""

$opcao = Read-Host "Escolha uma opção (1, 2 ou 3)"

switch ($opcao) {
    "1" {
        Write-Host ""
        Write-Host "✅ Se você já fez commit e push, o deploy será automático!" -ForegroundColor Green
        Write-Host "📋 Acesse https://vercel.com para verificar o deploy" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando deploy via Vercel CLI..." -ForegroundColor Yellow
        Write-Host "⚠️ Certifique-se de estar logado (vercel login)" -ForegroundColor Yellow
        Write-Host ""
        vercel --prod
    }
    "3" {
        Write-Host ""
        Write-Host "📋 Siga estes passos:" -ForegroundColor Cyan
        Write-Host "1. Acesse: https://vercel.com" -ForegroundColor White
        Write-Host "2. Clique em 'Add New Project'" -ForegroundColor White
        Write-Host "3. Conecte seu repositório Git" -ForegroundColor White
        Write-Host "4. Configure as variáveis de ambiente" -ForegroundColor White
        Write-Host "5. Clique em 'Deploy'" -ForegroundColor White
    }
    default {
        Write-Host "❌ Opção inválida" -ForegroundColor Red
    }
}

# 5. Lembretes finais
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📝 LEMBRETES IMPORTANTES:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Verifique se as variáveis de ambiente estão configuradas na Vercel:" -ForegroundColor Yellow
Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Após o deploy, teste:" -ForegroundColor Yellow
Write-Host "   - Login/Cadastro" -ForegroundColor Gray
Write-Host "   - Persistência de sessão" -ForegroundColor Gray
Write-Host "   - Renovação automática de token" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Boa sorte com o deploy!" -ForegroundColor Green

