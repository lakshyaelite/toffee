document.getElementById("generate-links").addEventListener("click", function() {
    const upiId = document.getElementById("upiId").value; // Gets UPI ID from generator input
    const name = document.getElementById("name").value; // Gets name from generator input
    const price = getToffeePrice(); // Gets toffee price from input, defaults to 5 if not provided
    const base = "https://toffee-roan.vercel.app/payment.html"; // TODO: Change to hosted link URL after testing
    const params = new URLSearchParams(); // Create a new URLSearchParams object to hold query parameters

    if (upiId) params.set("upiId", upiId); // Add UPI ID to query parameters
    if (name) params.set("name", name); // Add name to query parameters if provided
    params.set("price", price); // Add price to query parameters

    const query = params.toString(); // Convert parameters to a query string
    const link = `${base}?${query}`; // TODO: Use HTTPS protocol in production
    const iframeHTML = `<iframe src="${link}" style="border:0;width:100%;max-width:400px;height:500px;"></iframe>`; // Create iframe HTML with the generated link
    document.getElementById('iframeCode').value = iframeHTML; // Set the iframe code in the textarea
    document.getElementById('directLink').value = link; // Set the direct link in the textarea
    
    if (upiId != "") {
        document.getElementById('resultBox').classList.remove('d-none'); // Show the result box
    }
});

function getToffeePrice() {
    return document.getElementById('toffeePrice').value || 5;
}

// Add copy functionality for iframe code
const copyIframeBtn = document.getElementById('copyIframe');
if (copyIframeBtn) {
    copyIframeBtn.addEventListener('click', function() {
        const iframeTextarea = document.getElementById('iframeCode');
        iframeTextarea.select();
        iframeTextarea.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        copyIframeBtn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(() => {
            copyIframeBtn.innerHTML = '<i class="bi bi-copy"></i>';
        }, 1200);
    });
}

// Add copy functionality for direct link
const copyLinkBtn = document.getElementById('copyLink');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
        const directLinkInput = document.getElementById('directLink');
        directLinkInput.select();
        directLinkInput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        copyLinkBtn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(() => {
            copyLinkBtn.innerHTML = '<i class="bi bi-copy"></i>';
        }, 1200);
    });
}