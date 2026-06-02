# 🍬 Toffee — UPI Tip Link Generator

Toffee is a lightweight, zero-bloat, open-source peer-to-peer micro-payment widget generator designed for creators in India. It allows anyone to accept small UPI tips instantly without platform fees, middleman accounts, or complicated database integrations.

Built with a clean, responsive, system-adaptive dark mode.

---

## 🛠️ Features

* **Dynamic Parameter Architecture:** No backend server or database required. The payment page configuration is parsed entirely on the client side via URL query parameters.
* **Unified View (`pay.html`):** The standalone payment page and the embedded compact widget are combined into a single file to keep the codebase hyper-lean.
* **Native System Dark Mode:** Elegant dark theme support triggered automatically based on user system preferences (`prefers-color-scheme`).
* **Instant QR Generation:** On-the-fly execution via the highly performant `QRious` engine. QR codes double as direct deep-links for seamless context switching to mobile payment apps (GPay, PhonePe, Paytm).
* **Modern Clipboard APIs:** Up-to-date, secure copying mechanisms for effortless distribution of snippet parameters.

---

## 📂 File Structure

```text
├── index.html        # Creator panel (dashboard config setup)
├── pay.html          # Unified standalone payment page & embed widget
└── js/
    └── generate.js   # Clipboard controls & URL engine logic
    └── payment.js    # Decodes URL queries, injects QRious, handles intents

```

---

## ⚙️ URL Parameter API

The `pay.html` file accepts specific string parameters directly through the browser address bar:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `upiId` | String | **Yes** | The recipient's active VPA address (e.g., `name@bank`). |
| `price` | Number | No | The default base price per candy unit (defaults to `5`). |
| `name` | String | No | The display name shown at the top of the card widget. |
| `embed` | Boolean | No | Pass `true` to collapse structural card margins and strip footers. |

### Example Queries

* **Direct Link URL:**
`https://yourdomain.com/pay.html?upiId=lakshya@okaxis&name=Lakshya&price=10`
* **Iframe Safe Embed URL:**
`https://yourdomain.com/pay.html?upiId=lakshya@okaxis&name=Lakshya&price=10&embed=true`

---

## 📋 Integration Example

To display the compact tip component inside your blog sidebar, portfolio, or documentation page, drop the following responsive snippet directly into your HTML layout markup:

```html
<iframe 
  src="[https://yourdomain.com/pay.html?upiId=yourname@bank&name=Creator&price=5&embed=true](https://yourdomain.com/pay.html?upiId=yourname@bank&name=Creator&price=5&embed=true)" 
  style="border: 0; width: 100%; max-width: 420px; min-height: 480px;" 
  title="Support me via Toffee" 
  loading="lazy" 
  allowtransparency="true">
</iframe>

```

---

## ⚖️ License & Credits

Distributed under the MIT License. Built with 💚 by [Lakshya Singh Chauhan](https://lakshyasinghchauhan.com).