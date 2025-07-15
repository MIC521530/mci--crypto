// 主題切換 & 儲存
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');

// 預設用戶系統主題
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
  document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
});

// 簡單中英文切換
let isZh = true;
langToggleBtn.addEventListener('click', () => {
  const zh = {
    hero: "安全快速閃兑主流加密貨幣",
    sub: "僅接受新台幣匯款、ATM 轉帳與加密貨幣付款",
    orderTitle: "買 / 賣加密貨幣",
    uploadTitle: "上傳付款/轉帳證明",
    buy: "我要買",
    sell: "我要賣"
  };
  const en = {
    hero: "Secure and Fast Crypto Exchange",
    sub: "Only TWD bank transfer, ATM, and crypto payments accepted",
    orderTitle: "Buy / Sell Cryptocurrencies",
    uploadTitle: "Upload Payment Proof",
    buy: "Buy",
    sell: "Sell"
  };

  isZh = !isZh;
  document.getElementById('hero-text').innerText = isZh ? zh.hero : en.hero;
  document.getElementById('hero-sub').innerText = isZh ? zh.sub : en.sub;
  document.getElementById('order-title').innerText = isZh ? zh.orderTitle : en.orderTitle;
  document.getElementById('upload-title').innerText = isZh ? zh.uploadTitle : en.uploadTitle;

  // 切換買賣文字
  document.querySelectorAll('input[name="action"]').forEach((el, i) => {
    el.nextSibling.textContent = isZh ? (el.value === 'buy' ? zh.buy : zh.sell) : (el.value === 'buy' ? en.buy : en.sell);
  });
});

// 幣種中文對應
const cryptoNameMap = {
  bitcoin: '比特幣 (BTC)',
  ethereum: '以太幣 (ETH)',
  tether: '泰達幣 (USDT)',
  binancecoin: '幣安幣 (BNB)',
  ripple: '瑞波幣 (XRP)',
  dogecoin: '狗狗幣 (DOGE)'
};

// 顯示匯率與換算
async function fetchPrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,ripple,dogecoin&vs_currencies=twd');
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('取得幣價失敗:', err);
    return null;
  }
}

async function updateConvertedPrice() {
  const prices = await fetchPrices();
  const crypto = document.getElementById('crypto-select').value;
  const twdAmount = Number(document.getElementById('twd-amount').value);
  const convertedPriceEl = document.getElementById('converted-price');

  if (!prices) {
    convertedPriceEl.innerText = isZh ? '無法取得匯率資料' : 'Unable to fetch price data';
    return;
  }
  if (!twdAmount || twdAmount <= 0) {
    convertedPriceEl.innerText = isZh ? '請輸入有效的新台幣金額' : 'Please enter a valid TWD amount';
    return;
  }

  const priceTWD = prices[crypto]?.twd || 0;
  if (priceTWD === 0) {
    convertedPriceEl.innerText = isZh ? '無法取得匯率' : 'Price not available';
    return;
  }
  const cryptoAmount = (twdAmount / priceTWD).toFixed(6);
  const cryptoName = isZh ? cryptoNameMap[crypto] : cryptoNameMap[crypto];
  convertedPriceEl.innerText = (isZh ? '約可換取：' : 'You can get: ') + `${cryptoAmount} ${cryptoName}`;
}

document.getElementById('crypto-select').addEventListener('change', updateConvertedPrice);
document.getElementById('twd-amount').addEventListener('input', updateConvertedPrice);

// 表單送出處理
document.getElementById('trade-form').addEventListener('submit', (e) => {
  e.preventDefault();
  Swal.fire({
    icon: 'success',
    title: isZh ? '訂單已送出！' : 'Order Submitted!',
    text: isZh ? '我們會儘速與您聯絡確認。' : 'We will contact you shortly.',
    showConfirmButton: false,
    timer: 2000
  });
  e.target.reset();
  updateConvertedPrice();
});

// 動態顯示銀行資訊
function updateBankInfo() {
  const action = document.querySelector('input[name="action"]:checked').value;
  const html = isZh
    ? (action === 'buy' ? '💸 匯款資訊：<p>銀行名稱：樂天銀行</p><p>銀行代碼：826</p><p>帳號：81201000618469</p>' : 
    '🏦 收款銀行資訊 <label>銀行戶名：<input type="text" name="account-name" /></label><br /><label>銀行代碼：<select name="bank-code"><option value="004">台灣銀行 (004)</option></select></label>')
    : (action === 'buy' ? '💸 Remittance Info:<p>Bank Name: Rakuten Bank</p><p>Bank Code: 826</p><p>Account: 81201000618469</p>' : 
    '🏦 Receiving Bank Info <label>Account Name: <input type="text" name="account-name" /></label><br /><label>Bank Code:<select name="bank-code"><option value="004">Bank of Taiwan (004)</option></select></label>');
  document.getElementById('bank-info-container').innerHTML = html;
}

document.querySelectorAll('input[name="action"]').forEach(el =>
  el.addEventListener('change', updateBankInfo)
);

// 初始化
updateBankInfo();
updateConvertedPrice();
