
exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      success: true,
      backend: "running",
      hasApiKey: Boolean(process.env.OPENROUTER_API_KEY)
    })
  };
};
