# 🧹 Como Limpar o localStorage das Atividades

## Método 1: Console do Navegador (Recomendado)

1. Abra o console do navegador (pressione `F12` ou `Ctrl+Shift+I`)
2. Cole e execute o seguinte comando:

```javascript
localStorage.removeItem('brincafacil-child-development');
window.location.reload();
```

## Método 2: Usando a Função do Store

1. Abra o console do navegador (pressione `F12` ou `Ctrl+Shift+I`)
2. Cole e execute o seguinte comando:

```javascript
// Importar o store (se estiver disponível no window)
if (window.__BRINCAFACIL_STORE__) {
  window.__BRINCAFACIL_STORE__.clearActivityStorage();
  window.location.reload();
} else {
  // Método direto
  localStorage.removeItem('brincafacil-child-development');
  window.location.reload();
}
```

## O que isso faz?

- Remove todas as atividades salvas do localStorage
- Reseta o histórico de atividades
- Remove as imagens antigas que não estão funcionando
- Recarrega a página para aplicar as mudanças

## Após limpar

- Novas atividades registradas terão as imagens funcionando corretamente (salvas como base64)
- O histórico será limpo e começará do zero
- Todas as novas atividades terão as imagens persistindo corretamente




