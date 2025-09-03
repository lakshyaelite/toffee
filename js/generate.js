document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate-links").addEventListener("click", function() {
    const upiId = document.getElementById("upiId").value;
    const name = document.getElementById("name").value;
    const price = getToffeePrice();
    const base = "https://getmetoffee.vercel.app/payment.html";

    const params = new URLSearchParams();
    if (upiId) params.set("upiId", upiId);
    if (name) params.set("name", name);
    params.set("price", price);

    const link = `${base}?${params.toString()}`;
    const iframeHTML = `<iframe src="${link}" style="border:0;width:100%;max-width:400px;height:500px;"></iframe>`;
    document.getElementById('iframeCode').value = iframeHTML;
    document.getElementById('directLink').value = link;

    if (upiId) {
      document.getElementById('resultBox').classList.remove('d-none');
    }
  });

  // copy buttons
  const copyIframeBtn = document.getElementById('copyIframe');
  if (copyIframeBtn) {
    copyIframeBtn.addEventListener('click', function() {
      const iframeTextarea = document.getElementById('iframeCode');
      iframeTextarea.select();
      document.execCommand('copy');
      copyIframeBtn.innerHTML = '<i class="bi bi-check2"></i>';
      setTimeout(() => copyIframeBtn.innerHTML = '<i class="bi bi-copy"></i>', 1200);
    });
  }

  const copyLinkBtn = document.getElementById('copyLink');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      const directLinkInput = document.getElementById('directLink');
      directLinkInput.select();
      document.execCommand('copy');
      copyLinkBtn.innerHTML = '<i class="bi bi-check2"></i>';
      setTimeout(() => copyLinkBtn.innerHTML = '<i class="bi bi-copy"></i>', 1200);
    });
  }
});

function getToffeePrice() {
  return document.getElementById('toffeePrice').value || 5;
}
