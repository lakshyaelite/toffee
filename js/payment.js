document.addEventListener('DOMContentLoaded', function() {
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const payButton = document.getElementById('pay-button');
  const toffeeCountInput = document.getElementById('toffeeCount');
  const priceLabel = document.getElementById('toffeePriceLabel');
  const customMessage = document.getElementById('customMessage');
  const toffeeName = getParam('name') || 'Support';
  const toffeePrice = parseInt(getParam('price'), 10) || 5;

  const h1 = document.querySelector('h1');
  if (h1) h1.textContent = toffeeName;

  const wrapper = document.getElementById('button-qr');
  const qrDiv = document.getElementById('upi-qr');

  function ensureQrLib(cb) {
    if (window.QRious) return cb();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
    script.onload = cb;
    document.body.appendChild(script);
  }

  function getUpiIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('upi') || params.get('upiId');
  }

  function buildUpiUrl(amount) {
    const upiId = getUpiIdFromUrl();
    if (!upiId) return '';
    let note = `Tip to ${toffeeName}`;
    const msg = customMessage?.value;
    if (msg && msg.trim().length > 0) note += ': ' + msg.trim();
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(toffeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
  }

  function updateUI() {
    const count = Math.max(1, parseInt(toffeeCountInput?.value, 10) || 1);
    const amount = toffeePrice * count;

    if (priceLabel) priceLabel.textContent = `= ₹${amount}`;
    if (payButton) payButton.textContent = `Support ₹${amount}`;

    const url = buildUpiUrl(amount);
    if (!url || !qrDiv) {
      if (wrapper) wrapper.classList.add('d-none');
      return;
    }

    wrapper.classList.remove('d-none');

    ensureQrLib(() => {
      if (!qrDiv._qr) {
        qrDiv.innerHTML = '';
        qrDiv._qr = new QRious({
          element: document.createElement('canvas'),
          value: url,
          size: 220
        });
        qrDiv.appendChild(qrDiv._qr.element);
        qrDiv._qr.element.style.cursor = 'pointer';
        qrDiv._qr.element.title = 'Click to pay via UPI';
        qrDiv._qr.element.onclick = () => window.location.href = url;
      } else {
        qrDiv._qr.value = url;
      }
    });

    if (payButton) payButton.onclick = () => window.location.href = url;
  }

  if (toffeeCountInput) toffeeCountInput.addEventListener('input', updateUI);
  if (customMessage) customMessage.addEventListener('input', updateUI);

  updateUI();
});
