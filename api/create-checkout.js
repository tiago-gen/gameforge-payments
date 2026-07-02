const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
  });

  const preference = new Preference(client);

  try {
    const { plan, userId, userEmail } = req.body;

    const plans = {
      pro: { title: 'GameForge AI Pro', price: 49.90 },
      studio_vip: { title: 'GameForge AI Studio VIP', price: 149.90 }
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) return res.status(400).json({ error: 'Plano inválido' });

    const result = await preference.create({
      body: {
        items: [{
          title: selectedPlan.title,
          quantity: 1,
          unit_price: selectedPlan.price,
          currency_id: 'BRL'
        }],
        payer: { email: userEmail },
        external_reference: `${userId}_${plan}`,
        back_urls: {
          success: process.env.APP_URL + '/success',
          failure: process.env.APP_URL + '/failure',
          pending: process.env.APP_URL + '/pending'
        },
        auto_return: 'approved',
        notification_url: process.env.BACKEND_URL + '/api/webhook'
      }
    });

    res.status(200).json({
      init_point: result.init_point,
      preference_id: result.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
};
