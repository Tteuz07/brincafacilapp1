-- ============================================
-- COMANDO SQL DIRETO PARA SUPABASE DASHBOARD
-- ============================================
-- Cole este comando diretamente no SQL Editor do Supabase Dashboard

INSERT INTO authorized_emails (email) VALUES 
('mateus@kirvano.com')
ON CONFLICT (email) DO UPDATE SET 
  active = TRUE;






