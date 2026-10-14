module.exports = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Please send a POST request."
    });
  }

  try {
    const { message } = req.body || {};

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Please enter a message."
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "The AI API key isn't configured."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "You are ZZEBTRIX AI, a friendly and helpful AI assistant. Answer questions clearly. Help users create movie scripts, characters, scenes, dialogue, and creative stories."
            },
            {
              role: "user",
              content: message.trim()
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, data);

      return res.status(502).json({
        success: false,
        error:
          data.error?.message ||
          "The AI provider could not answer."
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        success: false,
        error: "The AI returned no answer."
      });
    }

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("ZZEBTRIX chat error:", error);

    return res.status(500).json({
      success: false,
      error: "The chatbot encountered an internal error."
    });
  }
};
