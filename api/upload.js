const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

export const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parse error" });
    }

    const file = files.file[0];
    const fileStream = fs.createReadStream(file.filepath);

    const formData = new FormData();
    formData.append("file", fileStream);
    formData.append("workspace", process.env.WORKSPACE_ID);
    formData.append("wait", "false");
    formData.append("webhook", "https://YOUR_DOMAIN/api/webhook");

    try {
      const affindaRes = await axios.post("https://api.affinda.com/v3/documents", formData, {
        headers: {
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
          ...formData.getHeaders(),
        },
      });

      res.status(200).json({ message: "Uploaded to Affinda", id: affindaRes.data.id });
    } catch (e) {
      console.error("Affinda upload error:", e.response?.data || e.message);
      res.status(500).json({ error: "Upload to Affinda failed" });
    }
  });
};
// This code handles file uploads to the Affinda API using formidable for parsing multipart/form-data.