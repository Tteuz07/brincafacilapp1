@echo off
echo Configurando ngrok...
ngrok.exe config add-authtoken SEU_TOKEN_AQUI
echo Iniciando ngrok...
ngrok.exe http 3001
pause


