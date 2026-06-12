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

        const mensajesRoblox = req.body.messages || [];

        // Construimos el cuerpo usando un modelo 100% activo y gratuito en la API actual de Groq
        const datosParaGroq = {
            model: "llama-3.1-8b-instant", // Modelo oficial, activo y ultra veloz
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
            console.error("Error devuelto por la API de Groq:", data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Error interno en el servidor proxy:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy de Verity corriendo con modelo actualizado en puerto ${PORT}`);
});
