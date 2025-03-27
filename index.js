
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/steamprice", async (req, res) => {
  const itemName = req.query.item;
  if (!itemName) {
    return res.status(400).json({ error: "Missing item name" });
  }

  const encoded = encodeURIComponent(itemName);
  const steamURL = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=2&market_hash_name=${encoded}`;

  try {
    const response = await fetch(steamURL);
    const data = await response.json();

    if (!data || !data.lowest_price) {
      return res.status(404).json({ error: "Price not found" });
    }

    res.json({
      success: true,
      price: data.lowest_price,
      volume: data.volume || "N/A"
    });
  } catch (err) {
    console.error("Steam fetch failed:", err);
    res.status(500).json({ error: "Steam request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
