document.addEventListener('DOMContentLoaded', function() {
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  const titleEl = document.getElementById('embedTitle');
  const subtitleEl = document.getElementById('embedSubtitle');
  const qrDiv = document.getElementById('embed-qr');
  const payBtn = document.getElementById('embed-pay');
  const countInput = document.getElementById('embedCount');
  const msgInput = document.getElementById('embedMessage');
  const priceLabel = document.getElementById('embedPriceLabel');

  const name = getParam('name') || 'Support';
  const basePrice = parseInt(getParam('price'), 10) || 5;

  titleEl.textContent = name;
  if (subtitleEl) subtitleEl.textContent = `Pay using UPI`;

  function getUpi() {
    return getParam('upi') || getParam('upiId');
  }

  function buildUpiUrl(amount) {
    const upi = getUpi();
    if (!upi) return '';
    let note = `Tip to ${name}`;
    const msg = msgInput?.value;
    if (msg && msg.trim().length) note += ': ' + msg.trim();
    return `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
  }

  function ensureQrLib(cb) {
    if (window.QRious) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
    s.onload = cb;
    document.body.appendChild(s);
  }

  function updateUI() {
    const count = Math.max(1, parseInt(countInput?.value, 10) || 1);
    const amount = basePrice * count;
    if (priceLabel) priceLabel.textContent = `= ₹${amount}`;

    const url = buildUpiUrl(amount);
    if (!url) {
      qrDiv.innerHTML = '';
      payBtn.disabled = true;
      return;
    }

    payBtn.disabled = false;

    ensureQrLib(() => {
      qrDiv.innerHTML = '';
      const canvas = document.createElement('canvas');
      const qr = new QRious({ element: canvas, value: url, size: 160 });
      qrDiv.appendChild(canvas);
      canvas.style.cursor = 'pointer';
      canvas.onclick = () => window.location.href = url;
    });

    payBtn.onclick = () => window.location.href = url;
    payBtn.textContent = `Pay ₹${amount}`;
  }

  if (countInput) countInput.addEventListener('input', updateUI);
  if (msgInput) msgInput.addEventListener('input', updateUI);

  updateUI();
});
