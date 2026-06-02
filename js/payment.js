document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get('embed') === 'true';

  // Toggle layout structure if embedded
  if (isEmbed) {
    document.body.classList.add('is-embedded');
    const mainContainer = document.querySelector('main');
    if (mainContainer) mainContainer.classList.remove('min-vh-100', 'p-3');
  }

  // DOM Elements
  const countInput = document.getElementById('toffeeCount');
  const priceLabel = document.getElementById('totalPriceLabel');
  const messageInput = document.getElementById('customMessage');
  const payButton = document.getElementById('payButton');
  const payeeNameEl = document.getElementById('payeeName');
  const qrWrapper = document.getElementById('qrWrapper');
  const qrDiv = document.getElementById('upiQr');

  // Query Parameters
  const upiId = params.get('upiId') || params.get('upi');
  const displayName = params.get('name') || 'Support';
  const basePrice = parseInt(params.get('price'), 10) || 5;

  // Set visual configurations
  payeeNameEl.textContent = displayName;

  // Gracefully pull in QR engine asset if not cached globally
  function loadQrEngine(callback) {
    if (window.QRious) return callback();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
    script.onload = callback;
    document.body.appendChild(script);
  }

  function compileUpiIntent(amount) {
    if (!upiId) return '';
    let note = `Toffee to ${displayName}`;
    const customMsg = messageInput.value.trim();
    if (customMsg) note += `: ${customMsg}`;

    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
  }

  function renderUI() {
    const units = Math.max(1, parseInt(countInput.value, 10) || 1);
    const calculatedSum = basePrice * units;

    priceLabel.textContent = `= ₹${calculatedSum}`;
    payButton.textContent = `Pay ₹${calculatedSum}`;

    const upiPayload = compileUpiIntent(calculatedSum);
    if (!upiPayload) {
      qrWrapper.classList.add('d-none');
      payButton.disabled = true;
      return;
    }

    payButton.disabled = false;
    qrWrapper.classList.remove('d-none');

    loadQrEngine(() => {
      qrDiv.innerHTML = '';
      const element = document.createElement('canvas');
      
      const qrInstance = new QRious({
        element: element,
        value: upiPayload,
        size: isEmbed ? 150 : 200
      });

      qrDiv.appendChild(qrInstance.element);
      
      // Wire up clickable actions straight to the generated intent deep-link
      qrInstance.element.style.cursor = 'pointer';
      qrInstance.element.onclick = () => window.location.href = upiPayload;
      payButton.onclick = (e) => {
        e.preventDefault();
        window.location.href = upiPayload;
      };
    });
  }

  // Attach event bindings
  countInput.addEventListener('input', renderUI);
  messageInput.addEventListener('input', renderUI);

  // Initial Paint Execution
  renderUI();
});