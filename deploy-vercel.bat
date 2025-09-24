@echo off
echo 🚀 Fazendo deploy para a Vercel...
echo.

echo 📦 Fazendo build...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!
echo.

echo 📤 Fazendo commit das alterações...
git add .
git commit -m "Deploy: Configuração para Vercel com SPA routing"
git push

if %errorlevel% neq 0 (
    echo ❌ Erro no git push!
    pause
    exit /b 1
)

echo ✅ Deploy iniciado!
echo.
echo 🌐 Acesse: https://brincafacil1.vercel.app
echo 🔐 Login: https://brincafacil1.vercel.app/login
echo.
echo 📧 Emails para teste:
echo   - admin@brincafacil.com
echo   - teste@exemplo.com
echo   - mateus@kirvano.com
echo.
pause

