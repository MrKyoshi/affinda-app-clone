// api/upload.js

import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// Disable the default body parser so we can handle multipart
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // 1) CORS headers to allow calls from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2) Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 3) Parse the incoming form (file + workspace + document_type)
  const form = new formidable.IncomingForm();
  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { workspace, document_type } = fields;
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 4) Stream the file into a FormData to send to Affinda
    const fileStream = fs.createReadStream(file.filepath || file.path);
    const fd = new FormData();
    fd.append('file', fileStream, file.originalFilename || file.newFilename);
    fd.append('workspace', workspace);
    if (document_type) {
      fd.append('document_type', document_type);
    }

    // 5) Call the Affinda API
    const affRes = await axios.post(
      'https://api.affinda.com/v3/documents',
      fd,
      {
        headers: {
          // form-data will set its own correct multipart headers
          ...fd.getHeaders(),
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
        },
      }
    );

    // 6) Return Affinda’s JSON to your frontend
    return res.status(200).json(affRes.data);

  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const error = err.response?.data || err.message;
    return res.status(status).json({ error });
  }
}
