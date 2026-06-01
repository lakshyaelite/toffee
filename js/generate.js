document.addEventListener("DOMContentLoaded", () => {
  // try to read profile from localStorage (set by register.js)
  let storedProfile = null;
  try { storedProfile = JSON.parse(localStorage.getItem('toffeeProfile') || 'null'); } catch(e) { storedProfile = null; }
  if (storedProfile && storedProfile.displayName) {
    const nameEl = document.getElementById('name');
    if (nameEl && (!nameEl.value || nameEl.value.trim() === '')) nameEl.value = storedProfile.displayName;
  }

  document.getElementById("generate-links").addEventListener("click", function() {
    const upiId = document.getElementById("upiId").value;
    const name = document.getElementById("name").value;
    const price = getToffeePrice();
    // point embed iframe to a compact local embed page
    const base = "iframe.html";

    const params = new URLSearchParams();
    if (upiId) params.set("upiId", upiId);
    if (name) params.set("name", name);
    params.set("price", price);

    const link = `${base}?${params.toString()}`;
    const iframeHTML = `<iframe src="${link}" style="border:0;width:100%;max-width:420px;height:520px;" title="Toffee embed" loading="lazy" allowtransparency="true"></iframe>`;
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
