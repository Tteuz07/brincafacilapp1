-- Script para criar tabela de pagamentos no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_payments_sale_id ON payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Comentário da tabela
COMMENT ON TABLE payments IS 'Tabela para armazenar webhooks de pagamentos da Kirvano';
COMMENT ON COLUMN payments.sale_id IS 'ID único da venda na Kirvano';
COMMENT ON COLUMN payments.email IS 'Email do comprador';
COMMENT ON COLUMN payments.status IS 'Status do pagamento (PAID, PENDING, etc.)';
COMMENT ON COLUMN payments.raw_payload IS 'Payload completo do webhook';



