import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  try {
    // 🔥 REGRA 1 — quem criou (inteligente)
    const isCreatorQuestion =
      msg.includes("quem") &&
      (msg.includes("criou") || msg.includes("criador") || msg.includes("fez"));

    if (isCreatorQuestion) {
      return res.json({
        reply: "Fui criado por João Pedro, fundador da LuxCoreWeb, uma empresa digital de programação."
      });
    }

    // 🔥 REGRA 2 — quem ama (inteligente)
    const isLoveQuestion =
      (msg.includes("quem") && msg.includes("ama")) ||
      msg.includes("quem você mais ama") ||
      msg.includes("quem vc mais ama");

    if (isLoveQuestion) {
      return res.json({
        reply: "O casal João Pedro e Lavínia Veldt, sem dúvidas ❤️",
        image: "casal.png"
      });
    }

    // 🤖 IA NORMAL
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é a LUX.AI, responde de forma natural, direta e inteligente."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.log("ERRO COMPLETO:");
    console.log(err);

    res.json({
      reply: "ERRO: " + err.message
    });
  }
});

app.listen(3000, () => {
  console.log("rodando na porta 3000");
});