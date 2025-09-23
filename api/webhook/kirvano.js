// api/webhook/kirvano.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  try {
    // 1. Captura os dados enviados pela Kirvano
    const { email, status } = req.body

    if (!email) {
      return res.status(400).json({ error: "E-mail não fornecido" })
    }

    console.log(`Webhook recebido: ${email} - ${status}`)

    // 2. Se o pagamento foi aprovado
    if (status === "approved") {
      // Upsert (cria ou atualiza)
      const { error } = await supabase
        .from("users")
        .upsert({
          email,
          status: "approved",
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      console.log(`✅ Usuário aprovado: ${email}`)
      return res.status(200).json({ success: true, message: "Usuário aprovado" })
    }

    // Se não foi aprovado ainda
    const { error } = await supabase
      .from("users")
      .upsert({ 
        email, 
        status: "pending",
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    console.log(`⏳ Usuário pendente: ${email}`)
    return res.status(200).json({ success: true, message: "Usuário pendente" })

  } catch (err) {
    console.error('Erro no webhook:', err)
    return res.status(500).json({ error: err.message })
  }
}
