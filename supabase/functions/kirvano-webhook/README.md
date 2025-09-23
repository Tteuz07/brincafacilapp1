# Kirvano Webhook Edge Function

Esta Edge Function processa webhooks da Kirvano para liberar acesso automático ao BrincaFácil App.

## Funcionalidades

- ✅ Validação de token de segurança
- ✅ Processamento de pagamentos aprovados
- ✅ Criação automática de usuários
- ✅ Liberação de acesso via email autorizado
- ✅ Registro de compras verificadas
- ✅ Idempotência (evita processamento duplicado)

## Configuração

1. Configure as variáveis de ambiente no Supabase
2. Deploy da função
3. Configure o webhook na Kirvano

## URL da Função

Após o deploy:
```
https://zbrqgtxrtbsezlutxopz.supabase.co/functions/v1/kirvano-webhook
```
sim

