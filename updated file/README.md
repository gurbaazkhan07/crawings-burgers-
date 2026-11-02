# Crawings by Bahar Cafe – Website

Static, dependency-free site (HTML + CSS + vanilla JS). No build step, no backend.

## Files
- `index.html` – page, SEO tags, structured data, security (CSP) headers
- `css/style.css` – forest-green / cream theme, glassmorphism, animations
- `js/menu.js` – **all menu items & prices + owner WhatsApp number** (edit here)
- `js/app.js` – search, filters, customise sheet, cart, validation, WhatsApp checkout
- `assets/` – `logo.png` (cropped from your cover photo), `burger.jpg`, `tacos.jpg`, `favicon.png`
- `robots.txt`, `sitemap.xml`

## Run locally
```
cd crawings-site
python3 -m http.server 8000      # then open http://localhost:8000
```

## Deploy (any static host)
Netlify / Vercel / Cloudflare Pages / GitHub Pages: upload the folder, publish directory = project root. No build command.
After you have the live domain, replace `https://example.com/` in `index.html` (canonical) and `sitemap.xml` / `robots.txt`.

## Edit the menu or number
Open `js/menu.js`. Each item is `{ id, name, sizes:[{label, price}] }`. `price: null` = "MRP". The WhatsApp number is `CRAWINGS_CONFIG.whatsapp` (country code, no `+`): `919898307771`.

## How ordering works
Customer adds items (size, spice, add-ons, notes) → cart totals update → checkout (name, 10-digit mobile, address for delivery) → "Send order on WhatsApp" opens WhatsApp with the full order pre-filled to +91 98983 07771. The customer taps Send. (WhatsApp links cannot send automatically; that is a WhatsApp rule.)

## Security notes
Strict Content-Security-Policy, no inline scripts, all user text rendered via `textContent`, cart re-validated from menu data on load (prices can't be tampered with via localStorage), input validation, honeypot field, `rel="noopener noreferrer"` on external links. For stronger protection add HSTS and the same CSP as HTTP headers on your host.

## Notes / to confirm with the client
- Prices were transcribed from the menu photo. Fish Fillet ₹300, Chicken Fillet ₹100 and Prawns ₹320 sit under the "Large" column on the printed menu with no Medium price; they are listed as single-size. Please confirm.
- Water Bottle and Cold Drink are "MRP" – shown as MRP and billed at the counter, not included in the total.
- Add-on prices (cheese slice ₹20, dips ₹10–20, cheese patty ₹80) come from the Extras column. Confirm that add-ons apply to all dishes offered.
- Food photos: only the burger and tacos photos supplied are used (hero and About). Add more to `assets/` and reference them in `index.html` or `menu.js` if desired.
- The logo is a crop of the photographed cover; for the sharpest result replace `assets/logo.png` with the original logo file.
- Google Fonts (Bangers, Barlow Condensed, Inter) approximate the menu lettering; the original menu typefaces were not supplied.
- Offers/discounts, delivery charges and online payment are not included.
