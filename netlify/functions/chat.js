exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        success: false,
        error: "Please send a POST request."
      })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Please enter a message."
        })
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "API key isn't configured."
        })
      };
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content: "You are ZZEBTRIX AI, a helpful and friendly AI assistant. Answer clearly and naturally."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, data);

      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: data.error?.message || "The AI provider rejected the request."
        })
      };
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          error: "The AI provider returned no answer."
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        reply: reply
      })
    };

  } catch (error) {
    console.error("Chat function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "The chatbot encountered an internal error."
      })
    };
  }
};
