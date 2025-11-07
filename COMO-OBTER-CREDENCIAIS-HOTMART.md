# 🔑 Como Obter Credenciais da Hotmart

## ⚠️ IMPORTANTE: Hot Token NÃO é suficiente!

O **Hot Token** serve apenas para webhooks. Para consultar compras por email, você precisa das **credenciais da API**.

---

## 📋 Passo a Passo Completo

### 1️⃣ Acessar o Painel da Hotmart

Acesse: https://app-vlc.hotmart.com/

Faça login com sua conta de **produtor** (quem criou o produto).

---

### 2️⃣ Ir para a Área de API

1. No menu lateral, clique em **"Ferramentas"**
2. Clique em **"API"** ou **"Desenvolvedores"**
3. Você verá uma seção para criar aplicações

**URL Direta:** https://app-vlc.hotmart.com/tools/api

---

### 3️⃣ Criar uma Aplicação (se necessário)

Se você ainda não tem uma aplicação criada:

1. Clique em **"Criar Nova Aplicação"** ou **"New Application"**
2. Dê um nome (ex: "BrincaFácil API")
3. Selecione os escopos necessários:
   - ✅ **Payments** (Pagamentos)
   - ✅ **Subscriptions** (Assinaturas)
4. Salve

---

### 4️⃣ Obter Client ID e Client Secret

Após criar a aplicação, você verá:

```
Client ID: abc123def456
Client Secret: xyz789uvw012
```

**⚠️ IMPORTANTE:** 
- Copie e guarde o **Client Secret** imediatamente
- Ele só aparece uma vez!
- Se perder, precisará gerar um novo

---

### 5️⃣ Gerar o Basic Auth

O Basic Auth é a combinação do Client ID e Client Secret em Base64.

**Opção 1: Online** (Mais Fácil)

1. Acesse: https://www.base64encode.org/
2. No campo, digite exatamente assim:
   ```
   SEU_CLIENT_ID:SEU_CLIENT_SECRET
   ```
   (com os dois pontos no meio, sem espaços)
3. Clique em **"Encode"**
4. Copie o resultado

**Exemplo:**
```
Se seu Client ID é: abc123
E seu Client Secret é: xyz789

Digite: abc123:xyz789
Resultado: YWJjMTIzOnh5ejc4OQ==
```

**Opção 2: Terminal Linux/Mac**
```bash
echo -n "SEU_CLIENT_ID:SEU_CLIENT_SECRET" | base64
```

**Opção 3: PowerShell (Windows)**
```powershell
$text = "SEU_CLIENT_ID:SEU_CLIENT_SECRET"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
[Convert]::ToBase64String($bytes)
```

---

### 6️⃣ Obter o Product ID

1. No painel da Hotmart, vá em **"Produtos"**
2. Clique no produto **BrincaFácil**
3. Na URL ou nas informações do produto, copie o **ID**
   - Geralmente é um número (ex: 12345)
   - Ou pode ser um código (ex: brincafacil-premium)

**Exemplo de URL:**
```
https://app-vlc.hotmart.com/products/12345/...
                                  ^^^^^ Este é o ID
```

---

### 7️⃣ Configurar no Arquivo .env

Crie o arquivo `.env` na raiz do projeto:

```bash
# Credenciais da API da Hotmart
VITE_HOTMART_CLIENT_ID=abc123def456
VITE_HOTMART_CLIENT_SECRET=xyz789uvw012
VITE_HOTMART_BASIC_AUTH=YWJjMTIzZGVmNDU2Onh5ejc4OXV2dzAxMg==
VITE_HOTMART_PRODUCT_ID=12345

# Hot Token (Opcional - apenas para webhooks)
HOTMART_WEBHOOK_SECRET=seu_hot_token_aqui
```

---

## 🧪 Testar se Funcionou

Execute o teste:

```bash
node test-hotmart-integration.js
```

Inicie o projeto:

```bash
npm run dev
```

Acesse: http://localhost:5173/login

Digite um email que tenha compra no seu produto.

---

## ❓ Perguntas Frequentes

### Só tenho o Hot Token, posso usar?

❌ **NÃO**. O Hot Token serve apenas para webhooks, não para consultar compras.

Você precisa criar uma aplicação na área de API para obter Client ID e Secret.

---

### Onde fica a área de API?

https://app-vlc.hotmart.com/tools/api

Se não aparecer, pode ser que:
1. Você não seja o **produtor** do produto (precisa ser dono)
2. Sua conta não tem permissão para criar APIs

---

### O Basic Auth é obrigatório?

✅ **SIM**! É usado para autenticação OAuth2.

Ele é simplesmente o Base64 de `CLIENT_ID:CLIENT_SECRET`.

---

### Posso usar o Hot Token no lugar do Basic Auth?

❌ **NÃO**. São coisas diferentes:

- **Hot Token**: Para validar webhooks
- **Basic Auth**: Para autenticar na API OAuth2

Você precisa do Basic Auth (gerado do Client ID e Secret).

---

### Como sei se configurei certo?

No console do navegador (F12), você deve ver:

```
🔧 Configuração da Hotmart: {
  configured: true,
  has_credentials: true,
  mode: "production"
}
```

Se aparecer `configured: false`, revise suas credenciais.

---

## 📞 Ainda com Dúvidas?

1. Acesse o suporte da Hotmart: https://atendimento.hotmart.com/
2. Procure por "API" ou "Client ID"
3. Entre em contato com o suporte técnico

---

## ✅ Checklist

- [ ] Acessei https://app-vlc.hotmart.com/tools/api
- [ ] Criei uma aplicação
- [ ] Copiei o Client ID
- [ ] Copiei o Client Secret
- [ ] Gerei o Basic Auth (Base64)
- [ ] Obtive o Product ID
- [ ] Criei o arquivo .env
- [ ] Configurei todas as variáveis
- [ ] Testei com `npm run dev`
- [ ] Sistema reconheceu a configuração

---

**Última atualização:** Outubro 2024




