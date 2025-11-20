# 🔄 Limpar Cache do Navegador

## ❌ Problema

Ainda está aparecendo uma requisição direta à tabela `licencas` mesmo depois de ter removido o código. Isso pode ser cache do navegador.

## ✅ Solução: Limpar Cache

### Chrome/Edge:

1. **Pressione `Ctrl + Shift + Delete`**
2. Selecione:
   - ✅ "Imagens e arquivos em cache"
   - ✅ "Cookies e outros dados do site"
3. Período: "Última hora" ou "Todo o período"
4. Clique em **"Limpar dados"**

### Ou fazer Hard Refresh:

1. **Pressione `Ctrl + Shift + R`** (Windows/Linux)
2. Ou **`Cmd + Shift + R`** (Mac)

### Ou limpar cache do site específico:

1. Abra o DevTools (F12)
2. Clique com botão direito no botão de recarregar
3. Selecione **"Esvaziar cache e atualizar forçadamente"**

## 🔍 Verificar se Funcionou

1. Abra o DevTools (F12)
2. Vá na aba **Network**
3. Recarregue a página
4. Procure por requisições que contenham `licencas`
5. **NÃO deve aparecer** nenhuma requisição direta à tabela
6. **Deve aparecer** apenas requisições RPC para `verificar_licenca`

## 📋 O que Deve Aparecer

### ✅ Correto (RPC):
```
POST /rest/v1/rpc/verificar_licenca
```

### ❌ Errado (Acesso Direto):
```
GET /rest/v1/licencas?select=status&email=eq...
```


