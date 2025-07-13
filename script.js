document.getElementById("twd-amount").addEventListener("input", async function () {
  const amount = this.value;
  const coin = document.getElementById("crypto-select").value;
  if (!amount || !coin) return;

  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=twd`);
  const data = await res.json();
  const rate = data[coin].twd;
  const converted = (amount / rate).toFixed(6);

  document.getElementById("converted-price").innerText = `預估可兌換：${converted} ${coin.toUpperCase()}`;
});
