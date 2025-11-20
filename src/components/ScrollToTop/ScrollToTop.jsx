import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que reseta o scroll para o topo sempre que a rota muda
 * Resolve o problema de voltar para uma página e ela estar no meio/fim
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sempre que a rota mudar, rolar para o topo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'instant' para ser mais rápido, ou 'smooth' para animação
    });
  }, [pathname]);

  return null;
}


