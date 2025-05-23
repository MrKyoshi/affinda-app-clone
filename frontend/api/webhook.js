module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const parsedDocument = req.body;

  console.log('✅ Webhook received parsed document from Affinda:');
  console.dir(parsedDocument, { depth: null });

  res.status(200).json({ message: 'Received successfully' });
};
