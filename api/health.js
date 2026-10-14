module.exports = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    success: true,
    service: "ZZEBTRIX AI",
    status: "online"
  });
};
