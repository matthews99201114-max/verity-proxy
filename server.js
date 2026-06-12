const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY; 
        
        if (!apiKey) {
            console.error("Error: Falta la variable GROQ_API_KEY en Render.");
            return res.status(500).json({ error: "Falta la configuración de la clave en el servidor." });
        }

        // Extraemos los mensajes que envió Roblox de forma segura
        const mensajesRoblox = req.body.messages || [];

        // Construimos el cuerpo exacto que Groq requiere, asegurando el modelo correcto
        const datosParaGroq = {
            model: "llama3-8b-8192", // Usamos este modelo que es ultra estable y 100% gratuito en Groq
            messages: mensajesRoblox,
            temperature: req.body.temperature || 0.7
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosParaGroq)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error de Groq:", data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Error interno en el proxy:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy gratuito de Verity activo en puerto ${PORT}`);
});
