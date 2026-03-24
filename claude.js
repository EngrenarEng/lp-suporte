// ═══════════════════════════════════════════════════════════════════════
// MÓDULO: Claude IA
//Editado devido a erro 400
// Gera respostas contextualizadas ao Learning Passport
// ═══════════════════════════════════════════════════════════════════════
const axios = require("axios");

async function gerarRespostaClaude({ mensagemAtual, historico = [], contexto = "" }) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY não definida");
    }

    if (!mensagemAtual || typeof mensagemAtual !== "string") {
      throw new Error("mensagemAtual inválida");
    }

    const mensagens = historico
      .filter((m) => m && typeof m.texto === "string" && m.texto.trim())
      .map((m) => ({
        role: m.de === "usuario" ? "user" : "assistant",
        content: m.texto.trim(),
      }));

    mensagens.push({
      role: "user",
      content: mensagemAtual.trim(),
    });

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: contexto || "Você é um assistente útil.",
        messages: mensagens,
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    return response.data?.content?.[0]?.text || null;

  } catch (err) {
    console.error("====== ERRO CLAUDE ======");
    console.error("Status:", err.response?.status);
    console.error("Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("Mensagem:", err.message);
    console.error("=========================");

    return null;
  }
}

module.exports = { gerarRespostaClaude };

