const cryptoSelect = document.getElementById("crypto-select");
const actionRadios = document.querySelectorAll("input[name='action']");
const btcWallet = document.getElementById("btc-wallet-info");
const bankForm = document.getElementById("bank-info-form");
const amountInput = document.getElementById("twd-amount");
const convertedDisplay = document.getElementById("converted-price");

// 1️⃣ 顯示/隱藏錢包與銀行欄位
function updateVisibility() {
  const selectedAction = [...actionRadios].find(r => r.checked).value;
  const selectedCoin = cryptoSelect.value;

  const isSellingBTC = selectedAction === "sell" && selectedCoin === "bitcoin";
  const isSelling = selectedAction === "sell";

  btcWallet.style.display = isSellingBTC ? "block" : "none";
  bankForm.style.display = isSelling ? "block" : "none";
}

// 2️⃣ 即時匯率換算
amountInput.addEventListener("input", async function () {
  const amount = this.value;
  const coin = cryptoSelect.value;
  if (!amount || !coin) return;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=twd`);
    const data = await res.json();
    const rate = data[coin]?.twd;
    if (!rate) return;

    const converted = (amount / rate).toFixed(6);
    convertedDisplay.innerText = `預估可兌換：${converted} ${coin.toUpperCase()}`;
  } catch (error) {
    convertedDisplay.innerText = "⚠️ 匯率取得失敗";
    console.error("CoinGecko API 錯誤：", error);
  }
});

// 初始化與監聽事件
cryptoSelect.addEventListener("change", () => {
  updateVisibility();
  amountInput.dispatchEvent(new Event("input")); // 重新換算匯率
});
actionRadios.forEach(radio => radio.addEventListener("change", () => {
  updateVisibility();
  amountInput.dispatchEvent(new Event("input")); // 重新換算匯率
}));

// 初始載入執行
window.addEventListener("DOMContentLoaded", () => {
  updateVisibility();
});
