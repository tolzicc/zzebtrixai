exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Please send a POST request."
      })
    };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "AI API key is not configured."
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Please enter a message."
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
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are ZZEBTRIX AI, a helpful, friendly AI assistant. Give clear and useful answers."
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
      console.error("OpenRouter request failed:", response.status);

      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "The AI service could not complete your request. Check your API key, model availability, and account credits."
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
        reply: data.choices?.[0]?.message?.content ||
          "Sorry, I couldn't generate a response."
      })
    };
  } catch (error) {
    console.error("Chat function error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong while contacting ZZEBTRIX AI."
      })
    };
  }
};
