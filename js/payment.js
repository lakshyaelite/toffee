// Remove all logic that disables/enables the custom amount box
// Only allow entering a custom amount if the user clicks/focuses the box, and deselect all presets

document.addEventListener('DOMContentLoaded', function() {
  const customInput = document.getElementById('customAmount');
  const presetRadios = document.querySelectorAll('input[name="tipType"]');

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

  // UPI payment button logic
  const payButton = document.getElementById('pay-button');
  if (payButton) {
    payButton.addEventListener('click', () => {
      // Get selected amount
      let amount = document.querySelector('input[name="tipType"]:checked')?.value;
      const customInput = document.getElementById('customAmount');
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

window.addEventListener('DOMContentLoaded', () => {
  // UPI payment button logic
  const payButton = document.getElementById('pay-button');
  if (payButton) {
    payButton.addEventListener('click', () => {
      // Get selected amount
      let amount = document.querySelector('input[name="tipType"]:checked')?.value;
      const customInput = document.getElementById('customAmount');
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
      let note = `Tip from ${payeeName}`;
      const customMessage = document.getElementById('customMessage')?.value;
      if (customMessage && customMessage.trim().length > 0) {
        note += ': ' + customMessage.trim();
      }
      const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;
      window.location.href = url;
    });
  }
});

