const express = require("express");
const { OpenAI } = require("openai");
const app = express();

app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { messages, model, temperature } = req.body;

    const response = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: messages,
      temperature: temperature || 0.7,
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la API" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo");
});
