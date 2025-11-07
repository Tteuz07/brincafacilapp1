// Debug de Sessão - BrincaFácil
// Execute este código no console do navegador para debug

console.log('🔍 DEBUG DE SESSÃO - BrincaFácil');

// Verificar localStorage
const storedUser = localStorage.getItem('brincafacil-user');
const storedChild = localStorage.getItem('brincafacil-child');

console.log('📊 DADOS NO LOCALSTORAGE:');
console.log('  - brincafacil-user:', storedUser ? 'presente' : 'ausente');
console.log('  - brincafacil-child:', storedChild ? 'presente' : 'ausente');

if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    console.log('👤 USUÁRIO:', {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name
    });
  } catch (error) {
    console.error('❌ ERRO AO PARSEAR USUÁRIO:', error);
  }
}

if (storedChild) {
  try {
    const child = JSON.parse(storedChild);
    console.log('👶 CRIANÇA:', {
      id: child.id,
      name: child.name,
      age: child.age
    });
  } catch (error) {
    console.error('❌ ERRO AO PARSEAR CRIANÇA:', error);
  }
}

// Simular a lógica do App.jsx
const hasUser = !!storedUser;
const hasChild = !!storedChild;
const willRedirectToLogin = !hasUser;
const willRedirectToSetup = hasUser && !hasChild;
const willShowLayout = hasUser && hasChild;

console.log('🎯 CONDIÇÕES DE RENDERIZAÇÃO:');
console.log('  - hasUser:', hasUser);
console.log('  - hasChild:', hasChild);
console.log('  - willRedirectToLogin:', willRedirectToLogin);
console.log('  - willRedirectToSetup:', willRedirectToSetup);
console.log('  - willShowLayout:', willShowLayout);

if (willRedirectToLogin) {
  console.log('🔴 RESULTADO: REDIRECIONANDO PARA LOGIN');
} else if (willRedirectToSetup) {
  console.log('🟡 RESULTADO: REDIRECIONANDO PARA SETUP');
} else if (willShowLayout) {
  console.log('🟢 RESULTADO: MOSTRANDO LAYOUT');
} else {
  console.log('⚪ RESULTADO: ESTADO INDEFINIDO');
}

// Função para criar sessão de teste
function createTestSession() {
  console.log('🔧 CRIANDO SESSÃO DE TESTE...');
  
  const testUser = {
    id: 'test-user-123',
    email: 'teste@exemplo.com',
    user_metadata: {
      name: 'Usuário Teste'
    }
  };
  
  const testChild = {
    id: 'child-test-123',
    name: 'Criança Teste',
    age: 5,
    avatar: '🧒',
    interests: ['brincadeiras', 'desenhos'],
    space: 'casa',
    companionship: 'sozinho'
  };
  
  try {
    localStorage.setItem('brincafacil-user', JSON.stringify(testUser));
    localStorage.setItem('brincafacil-child', JSON.stringify(testChild));
    console.log('✅ SESSÃO DE TESTE CRIADA!');
    console.log('🔄 RECARREGUE A PÁGINA PARA TESTAR');
  } catch (error) {
    console.error('❌ ERRO AO CRIAR SESSÃO:', error);
  }
}

// Função para limpar sessão
function clearSession() {
  console.log('🗑️ LIMPANDO SESSÃO...');
  localStorage.removeItem('brincafacil-user');
  localStorage.removeItem('brincafacil-child');
  console.log('✅ SESSÃO LIMPA!');
  console.log('🔄 RECARREGUE A PÁGINA PARA TESTAR');
}

console.log('🛠️ FUNÇÕES DISPONÍVEIS:');
console.log('  - createTestSession() - Criar sessão de teste');
console.log('  - clearSession() - Limpar sessão');
console.log('  - Recarregue a página para testar');


