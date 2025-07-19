// 主題切換 & 儲存
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');

// 預設主題
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

  document.querySelectorAll('input[name="action"]').forEach((el) => {
    el.nextSibling.textContent = isZh ? (el.value === 'buy' ? zh.buy : zh.sell) : (el.value === 'buy' ? en.buy : en.sell);
  });

  updateBankInfo();
  updateConvertedPrice();
});

// 幣種對應中文
const cryptoNameMap = {
  bitcoin: '比特幣 (BTC)',
  ethereum: '以太幣 (ETH)',
  tether: '泰達幣 (USDT)',
  binancecoin: '幣安幣 (BNB)',
  ripple: '瑞波幣 (XRP)',
  dogecoin: '狗狗幣 (DOGE)'
};

// 接收錢包 QR 對應表
const qrMap = {
  bitcoin: { img: 'btc-qr.png', addr: 'bc1pvrx4wwuwn6wf3a9ed4fu6enwrcdexdad784elfq6h5y3eejdgdzs0emuvf' },
  ethereum: { img: 'eth-qr.png', addr: '0x705d2f673516067376daad1fbb2677abd7fd7bc1' },
  tether: { img: 'usdt-qr.png', addr: 'TXyDywmpLUrjn4hr5LFMC3rKPmGd7a6zFp' },
  ripple: { img: 'xrp-qr.png', addr: '0x705d2f673516067376daad1fbb2677abd7fd7bc1' },
  binancecoin: { img: 'bnb-qr.png', addr: '0x705d2f673516067376daad1fbb2677abd7fd7bc1' },
  dogecoin: { img: 'doge-qr.png', addr: 'DNwNYeeWSfVAKWR9gFcLvh27mcmZF8zr5n' }
};

// 顯示 QR 與地址
function updateQR() {
  const action = document.querySelector('input[name="action"]:checked').value;
  const crypto = document.getElementById('crypto-select').value;
  const c = document.getElementById('qr-display');
  const walletInfoContainer = document.getElementById('wallet-info-container');

  if (action === 'sell' && qrMap[crypto]) {
    const { img, addr } = qrMap[crypto];
    let walletInfo = '';

    // 根據選擇的幣種更新錢包資訊
    switch (crypto) {
      case 'bitcoin':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: Bitcoin</p>
          <p>錢包地址: bc1pvrx4wwuwn6wf3a9ed4fu6enwrcdexdad784elfq6h5y3eejdgdzs0emuvf</p>
        `;
        break;
      case 'ethereum':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: Ethereum</p>
          <p>錢包地址: 0x705d2f673516067376daad1fbb2677abd7fd7bc1</p>
        `;
        break;
      case 'tether':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: Tron</p>
          <p>錢包地址: TXyDywmpLUrjn4hr5LFMC3rKPmGd7a6zFp</p>
        `;
        break;
      case 'binancecoin':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: BNB Chain</p>
          <p>錢包地址: 0x705d2f673516067376daad1fbb2677abd7fd7bc1</p>
        `;
        break;
      case 'ripple':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: BNB Chain</p>
          <p>錢包地址: 0x705d2f673516067376daad1fbb2677abd7fd7bc1</p>
        `;
        break;
      case 'dogecoin':
        walletInfo = `
          <h3>錢包資訊:</h3>
          <p>錢包網絡: Dogecoin</p>
          <p>錢包地址: DNwNYeeWSfVAKWR9gFcLvh27mcmZF8zr5n</p>
        `;
        break;
      default:
        walletInfo = `<p>無此幣種的錢包資訊。</p>`;
    }

    // 顯示QR和錢包資訊
    c.innerHTML = `
      <h3>${isZh ? '📲 接收地址：' : '📲 Receive Address:'}</h3>
      <p style="word-break: break-all;">${addr}</p>
      <img src="assets/qr/${img}" alt="QR Code" style="max-width:200px;" />
    `;
    walletInfoContainer.innerHTML = walletInfo;
  } else {
    c.innerHTML = '';
    walletInfoContainer.innerHTML = '';
  }
}

// 匯率換算
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

// 買/賣選擇切換動態銀行資訊
function updateBankInfo() {
  const action = document.querySelector('input[name="action"]:checked').value;
  const html = isZh
    ? (action === 'buy'
        ? '💸 匯款資訊：<p>銀行名稱：樂天銀行</p><p>銀行代碼：826</p><p>帳號：81201000618469</p>'
        : '🏦 收款銀行資訊 <label>銀行戶名：<input type="text" name="account-name" /></label><br /><label>銀行代碼：<select name="bank-code"><option value="004">台灣銀行 (004)</option></select></label>')
    : (action === 'buy'
        ? '💸 Remittance Info:<p>Bank Name: Rakuten Bank</p><p>Bank Code: 826</p><p>Account: 81201000618469</p>'
        : '🏦 Receiving Bank Info <label>Account Name: <input type="text" name="account-name" /></label><br /><label>Bank Code:<select name="bank-code"><option value="004">Bank of Taiwan (004)</option></select></label>');
  document.getElementById('bank-info-container').innerHTML = html;
  updateQR(); // 切換買/賣時一併更新 QR
}

// 表單送出提示
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
  updateQR();
});

// 綁定事件
document.getElementById('crypto-select').addEventListener('change', () => {
  updateConvertedPrice();
  updateQR();
});
document.getElementById('twd-amount').addEventListener('input', updateConvertedPrice);
document.querySelectorAll('input[name="action"]').forEach(el =>
  el.addEventListener('change', () => {
    updateBankInfo();
    updateQR();
  })
);

// 初始化
updateBankInfo();
updateConvertedPrice();
updateQR();
