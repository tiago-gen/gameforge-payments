module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      console.log('Pagamento recebido, ID:', data.id);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no webhook' });
  }
};
