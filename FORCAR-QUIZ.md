# 🔧 Forçar Quiz a Aparecer

## ❌ Problema

O quiz não está aparecendo mesmo quando o usuário não tem perfil de criança.

## ✅ Solução Temporária (Para Teste)

Execute no console do navegador (F12):

```javascript
// Limpar flag de onboarding
localStorage.removeItem('bf_onboarding_done')

// Limpar perfil do store
const store = useAppStore.getState()
store.setChild(null)

// Forçar redirecionamento
window.location.href = '/child-setup'
```

## 🔍 Verificar o Problema

1. **Abra o console (F12)**
2. **Procure por estes logs:**
   - `🔍 [HomePage] ========== VERIFICANDO QUIZ ==========`
   - `📋 [HomePage] Flag de onboarding no localStorage:`
   - `⚠️ [HomePage] ========== NENHUM PERFIL ENCONTRADO! ==========`
   - `🔄 [HomePage] Redirecionando AGORA para /child-setup`

3. **Se não aparecer o log de verificação:**
   - O `useEffect` pode não estar sendo executado
   - Verifique se há erros no console

4. **Se aparecer mas não redirecionar:**
   - Pode haver algum problema com o `window.location.href`
   - Tente executar manualmente: `window.location.href = '/child-setup'`

## 🐛 Debug Manual

Execute no console:

```javascript
// Verificar estado atual
const store = useAppStore.getState()
console.log('Estado atual:', {
  isAuthenticated: store.isAuthenticated,
  hasUser: !!store.user,
  userEmail: store.user?.email,
  hasChild: !!store.child,
  childName: store.child?.name,
  onboardingFlag: localStorage.getItem('bf_onboarding_done')
})

// Se não tem perfil, forçar redirecionamento
if (!store.child && !localStorage.getItem('bf_onboarding_done')) {
  console.log('Forçando redirecionamento para quiz...')
  window.location.href = '/child-setup'
}
```


