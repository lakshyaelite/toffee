// Remove all logic that disables/enables the custom amount box
// Only allow entering a custom amount if the user clicks/focuses the box, and deselect all presets

document.addEventListener('DOMContentLoaded', function() {
  const customInput = document.getElementById('customAmount');
  const presetRadios = document.querySelectorAll('input[name="tipType"]');
  const payButton = document.getElementById('pay-button');
  const form = document.querySelector('form');

  // Toffee price and count logic
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  const toffeePrice = parseInt(getParam('price'), 10) || 5;
  const toffeeCountInput = document.getElementById('toffeeCount');
  const priceLabel = document.getElementById('toffeePriceLabel');
  const customMessage = document.getElementById('customMessage');
  const toffeeName = getParam('name') || 'Support';
  // Set the heading to the custom name if present
  const h1 = document.querySelector('h1');
  if (h1) h1.textContent = toffeeName;

  function updateToffeePrice() {
    const count = Math.max(1, parseInt(toffeeCountInput.value, 10) || 1);
    priceLabel.textContent = `= ₹${toffeePrice * count}`;
    if (payButton) payButton.textContent = `Support ₹${toffeePrice * count}`;
  }
  if (toffeeCountInput) {
    toffeeCountInput.addEventListener('input', updateToffeePrice);
    updateToffeePrice();
  }

  // Device detection
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // QR code logic (desktop only)
  function showQrCode() {
    const qrDivId = 'upi-qr';
    let qrDiv = document.getElementById(qrDivId);
    if (isMobile()) {
      // Remove QR if present
      if (qrDiv) qrDiv.remove();
      if (payButton) payButton.style.display = '';
      return;
    }
    // On desktop, always show QR and hide pay button
    if (payButton) payButton.style.display = 'none';
    // Place QR in #button-qr
    if (!qrDiv) {
      qrDiv = document.createElement('div');
      qrDiv.id = qrDivId;
      qrDiv.style.textAlign = 'center';
      qrDiv.style.margin = '24px 0';
      document.getElementById('button-qr').appendChild(qrDiv);
    }
    // Add QRious if not present
    if (!window.QRious) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
      script.onload = updateQr;
      document.body.appendChild(script);
    } else {
      updateQr();
    }
    function updateQr() {
      // Get UPI details
      const upiId = getUpiIdFromUrl();
      const count = Math.max(1, parseInt(toffeeCountInput.value, 10) || 1);
      const amount = toffeePrice * count;
      let note = `Tip to ${toffeeName}`;
      const msg = customMessage?.value;
      if (msg && msg.trim().length > 0) {
        note += ': ' + msg.trim();
      }
      const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(toffeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
      // Create or update QR
      let qr = qrDiv.querySelector('canvas');
      if (!qrDiv._qr) {
        qrDiv.innerHTML = '';
        qrDiv._qr = new QRious({
          element: document.createElement('canvas'),
          value: url,
          size: 220
        });
        qrDiv.appendChild(qrDiv._qr.element);
        // Make QR clickable
        qrDiv._qr.element.style.cursor = 'pointer';
        qrDiv._qr.element.title = 'Click to pay via UPI';
        qrDiv._qr.element.onclick = function() { window.location.href = url; };
      } else {
        qrDiv._qr.value = url;
      }
    }
    // Update QR live on input changes
    [toffeeCountInput, customMessage].forEach(el => {
      if (el) el.addEventListener('input', updateQr);
    });
    // Initial QR
    updateQr();
  }
  showQrCode();

  // UPI payment button logic (mobile only)
  if (payButton) {
    payButton.addEventListener('click', () => {
      if (!isMobile()) return; // Only allow on mobile
      const upiId = getUpiIdFromUrl();
      if (!upiId) return;
      const count = Math.max(1, parseInt(toffeeCountInput.value, 10) || 1);
      const amount = toffeePrice * count;
      let note = `Tip to ${toffeeName}`;
      const msg = customMessage?.value;
      if (msg && msg.trim().length > 0) {
        note += ': ' + msg.trim();
      }
      const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(toffeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
      window.location.href = url;
    });
  }

  // Enable the custom input when focused, and deselect presets
  if (customInput) {
    customInput.disabled = false;
    customInput.addEventListener('focus', function() {
      presetRadios.forEach(radio => radio.checked = false);
      customInput.setAttribute('required', 'required');
    });
    customInput.addEventListener('input', function() {
      presetRadios.forEach(radio => radio.checked = false);
      customInput.setAttribute('required', 'required');
    });
  }

  // If a preset is selected, clear the custom input and remove required
  presetRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (radio.checked) {
        customInput.value = '';
        customInput.removeAttribute('required');
      }
    });
  });

  // Set Tip heading with name if present
  const name = getNameFromUrl();
  if (name) {
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = `Tip ${name}`;
  }

  // UPI payment button logic (mobile only)
  if (payButton) {
    payButton.addEventListener('click', () => {
      if (!isMobile()) return; // Only allow on mobile
      // Get selected amount
      let amount = document.querySelector('input[name="tipType"]:checked')?.value;
      // If no preset is selected or custom input has a value, use custom
      if ((!amount || amount === '' || amount === undefined) || (customInput && customInput.value && customInput.value.trim() !== '')) {
        amount = customInput.value;
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        // Optionally, you could show a custom error message in the UI here
        return;
      }
      // UPI details from URL param
      const upiId = getUpiIdFromUrl();
      if (!upiId) {
        // Optionally, you could show a custom error message in the UI here
        return;
      }
      const payeeName = name || 'Support';
      let note = `Tip to ${payeeName}`;
      const customMessage = document.getElementById('customMessage')?.value;
      if (customMessage && customMessage.trim().length > 0) {
        note += ': ' + customMessage.trim();
      }
      const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
      window.location.href = url;
    });
  }
});

// Add the name from the URL parameter to the Tip heading
function getNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

function getUpiIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  // Support both ?upi= and ?upiId= for compatibility
  return params.get('upi') || params.get('upiId');
}

