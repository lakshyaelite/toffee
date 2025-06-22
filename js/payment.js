// Remove all logic that disables/enables the custom amount box
// Only allow entering a custom amount if the user clicks/focuses the box, and deselect all presets

document.addEventListener('DOMContentLoaded', function() {
  const customInput = document.getElementById('customAmount');
  const presetRadios = document.querySelectorAll('input[name="tipType"]');
  const payButton = document.getElementById('pay-button');
  const form = document.querySelector('form');

  // Device detection
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // QR code logic (desktop only)
  function showQrCode() {
    // Remove button if present
    if (payButton) payButton.style.display = 'none';
    // Check if QR already exists
    let qrDiv = document.getElementById('upi-qr');
    if (!qrDiv) {
      qrDiv = document.createElement('div');
      qrDiv.id = 'upi-qr';
      qrDiv.style.textAlign = 'center';
      qrDiv.style.margin = '24px 0';
      form.parentNode.insertBefore(qrDiv, form.nextSibling);
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
      const name = getNameFromUrl() || 'Support';
      let amount = document.querySelector('input[name="tipType"]:checked')?.value;
      if ((!amount || amount === '' || amount === undefined) || (customInput && customInput.value && customInput.value.trim() !== '')) {
        amount = customInput.value;
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) amount = '';
      let note = `Tip to ${name}`;
      const customMessage = document.getElementById('customMessage')?.value;
      if (customMessage && customMessage.trim().length > 0) {
        note += ': ' + customMessage.trim();
      }
      const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
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
    [customInput, document.getElementById('customMessage'), ...presetRadios].forEach(el => {
      if (el) el.addEventListener('input', updateQr);
      if (el && el.type === 'radio') el.addEventListener('change', updateQr);
    });
  }

  if (!isMobile()) {
    showQrCode();
    if (payButton) payButton.style.display = 'none';
  } else {
    if (payButton) payButton.style.display = '';
    // Remove QR if present
    const qrDiv = document.getElementById('upi-qr');
    if (qrDiv) qrDiv.remove();
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

