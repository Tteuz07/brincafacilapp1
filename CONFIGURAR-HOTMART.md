# Guia Rápido: Configurar Hotmart

## 📋 Passo a Passo

### 1️⃣ Obter Credenciais da Hotmart

1. Acesse: https://app-vlc.hotmart.com/
2. Faça login com sua conta
3. Vá em **Ferramentas** > **API**
4. Clique em **Criar nova aplicação** (se necessário)
5. Anote:
   - **Client ID** (ex: `abc123`)
   - **Client Secret** (ex: `xyz789`)

### 2️⃣ Gerar Basic Auth

O Basic Auth é a combinação do Client ID e Client Secret em Base64:

**Opção 1: Comando no Terminal**
```bash
echo -n "SEU_CLIENT_ID:SEU_CLIENT_SECRET" | base64
```

**Opção 2: Online**
1. Acesse: https://www.base64encode.org/
2. Digite: `SEU_CLIENT_ID:SEU_CLIENT_SECRET`
3. Clique em **Encode**
4. Copie o resultado

**Exemplo:**
- Client ID: `abc123`
- Client Secret: `xyz789`
- String para converter: `abc123:xyz789`
- Resultado em Base64: `YWJjMTIzOnh5ejc4OQ==`

### 3️⃣ Obter Product ID

1. No painel da Hotmart, vá em **Produtos**
2. Selecione o produto **BrincaFácil**
3. Copie o **ID do Produto** (número)
4. Se não tiver, use: `brincafacil-premium`

### 4️⃣ Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```bash
# Hotmart - Configuração
VITE_HOTMART_API_URL=https://developers.hotmart.com/payments/api/v1
VITE_HOTMART_CLIENT_ID=SEU_CLIENT_ID_AQUI
VITE_HOTMART_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
VITE_HOTMART_BASIC_AUTH=SEU_BASIC_AUTH_BASE64_AQUI
VITE_HOTMART_PRODUCT_ID=SEU_PRODUCT_ID_AQUI

# Token para webhook (opcional)
HOTMART_WEBHOOK_SECRET=brincafacil01
```

**Exemplo preenchido:**
```bash
VITE_HOTMART_API_URL=https://developers.hotmart.com/payments/api/v1
VITE_HOTMART_CLIENT_ID=abc123
VITE_HOTMART_CLIENT_SECRET=xyz789
VITE_HOTMART_BASIC_AUTH=YWJjMTIzOnh5ejc4OQ==
VITE_HOTMART_PRODUCT_ID=12345
HOTMART_WEBHOOK_SECRET=brincafacil01
```

### 5️⃣ Testar a Integração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:5173/login

3. Digite um email que tenha compra na Hotmart

4. Verifique no console do navegador (F12):
   - ✅ "Hotmart Configurada"
   - 🔑 "Token obtido com sucesso"
   - ✅ "Compra confirmada na Hotmart"

### 6️⃣ Emails de Teste (Modo Demo)

Se não tiver as credenciais configuradas, use estes emails para testar:
- `demo@brincafacil.com`
- `teste@exemplo.com`
- `admin@brincafacil.com`

## ❓ Perguntas Frequentes

### Como obter as credenciais da Hotmart?
Acesse https://app-vlc.hotmart.com/tools/api e crie uma aplicação.

### O Basic Auth é obrigatório?
Sim, é necessário para autenticação OAuth2 com a API da Hotmart.

### Como gerar o Basic Auth?
É o Base64 de `CLIENT_ID:CLIENT_SECRET` (com os dois pontos no meio).

### O que é o Product ID?
É o identificador do seu produto na Hotmart. Encontre em Produtos > [Seu Produto].

### Posso testar sem as credenciais?
Sim! O sistema funciona em modo demo com os emails de teste listados acima.

### Onde vejo os logs?
Abra o console do navegador (F12) e veja as mensagens em tempo real.

## 🔍 Verificar Configuração

Abra o console do navegador e procure por:

✅ **Configuração OK:**
```
🔧 Configuração da Hotmart: {
  configured: true,
  has_credentials: true,
  product_id: "12345",
  mode: "production"
}
```

❌ **Configuração Incompleta:**
```
🔧 Configuração da Hotmart: {
  configured: false,
  has_credentials: false,
  product_id: "brincafacil-premium",
  mode: "demo"
}
```

## 📚 Documentação Completa

Para mais detalhes, veja: [HOTMART-INTEGRATION.md](./HOTMART-INTEGRATION.md)

---

**Precisa de ajuda?**  
Consulte a documentação completa ou entre em contato com o suporte.




