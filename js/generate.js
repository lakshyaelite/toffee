document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate-links");
  const resultBox = document.getElementById('resultBox');
  const iframeCodeArea = document.getElementById('iframeCode');
  const directLinkInput = document.getElementById('directLink');

  generateBtn.addEventListener("click", () => {
    const upiId = document.getElementById("upiId").value.trim();
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById('toffeePrice').value || 5;

    if (!upiId) {
      alert("Please enter a valid UPI ID first.");
      return;
    }

    // Capture location to support absolute root path generation
    const hostPath = window.location.href.replace('index.html', '').split('?')[0];
    
    const params = new URLSearchParams();
    params.set("upiId", upiId);
    if (name) params.set("name", name);
    params.set("price", price);

    // Direct web page URL
    const targetUrlDirect = `${hostPath}pay.html?${params.toString()}`;
    
    // Core embed context configurations
    params.set("embed", "true");
    const targetUrlEmbed = `${hostPath}pay.html?${params.toString()}`;
    const iframeSnippet = `<iframe src="${targetUrlEmbed}" style="border:0;width:100%;max-width:420px;height:auto;min-height:480px;" title="Toffee Widget" loading="lazy" allowtransparency="true"></iframe>`;

    // Populate the inputs
    iframeCodeArea.value = iframeSnippet;
    directLinkInput.value = targetUrlDirect;

    resultBox.classList.remove('d-none');
    resultBox.scrollIntoView({ behavior: 'smooth' });
  });

  // Setup Clipboard Interaction Handlers
  setupClipboardHandler('copyIframe', 'iframeCode');
  setupClipboardHandler('copyLink', 'directLink');
});

function setupClipboardHandler(triggerId, targetInputId) {
  const btn = document.getElementById(triggerId);
  const target = document.getElementById(targetInputId);
  if (!btn || !target) return;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(target.value).then(() => {
      btn.innerHTML = '<i class="bi bi-check-lg text-success"></i>';
      btn.classList.add('border-success');
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-copy"></i>';
        btn.classList.remove('border-success');
      }, 1500);
    }).catch(err => console.error('Could not copy text: ', err));
  });
}