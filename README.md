# EliteEvents Co. — Professional Event Management Website

A modern, fully responsive multi-page event management website built with HTML5, CSS3, Bootstrap 5, and vanilla JavaScript, powered by a Node.js/Express backend for contact form email delivery via Nodemailer/SMTP.

---

## ✨ Features

- **5 fully responsive pages**: Home, About, Services, Portfolio, Contact
- **Premium design**: Dark navy, white, and gold color palette with smooth animations
- **Bootstrap 5** responsive grid + Bootstrap Icons
- **Scroll animations** via IntersectionObserver (fade-in effects)
- **Sticky navbar** with scroll-triggered style change
- **Portfolio gallery** with live JavaScript category filtering
- **Contact form** with full validation, loading state, honeypot spam protection, and real email delivery
- **Rate limiting**: 10 requests per 15 minutes per IP on the contact endpoint
- **Floating WhatsApp** button with pulse animation
- **Google Maps** embed on contact page
- **Newsletter** subscription endpoint
- **SEO-ready**: meta tags, Open Graph, semantic HTML, accessible form labels
- Zero frontend frameworks — pure HTML/CSS/JS

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm v9.0.0 or higher

Check your installed versions:
```bash
node --version
npm --version
```

---

## 🚀 Quick Start

**1. Navigate to the server directory:**
```bash
cd event-management-website/server
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**
```bash
cp .env.example .env
```
Open `.env` and fill in your SMTP credentials (see [Environment Configuration](#️-environment-configuration) below).

**4. Start the server:**
```bash
npm start
```

**5. Open in your browser:**
```
http://localhost:3000
```

For development with auto-restart on file changes:
```bash
npm run dev
```

---

## ⚙️ Environment Configuration

All configuration lives in `server/.env`. **Never commit this file.**

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `BUSINESS_EMAIL` | Where contact form emails go | `hello@eliteevents.co` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port number | `587` |
| `SMTP_SECURE` | Use TLS (`true` for port 465) | `false` |
| `SMTP_USER` | Your SMTP username/email | `your@gmail.com` |
| `SMTP_PASS` | SMTP password or App Password | `xxxx xxxx xxxx xxxx` |

### Gmail App Password Setup

Gmail requires an **App Password** — your regular Gmail password will not work.

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Under "How you sign in to Google", click **2-Step Verification** (must be enabled)
4. Scroll to the bottom and click **App Passwords**
5. Select **Mail** as the app, **Other** as the device, type `EliteEvents`
6. Click **Generate** — copy the 16-character password shown
7. Paste it as the value of `SMTP_PASS` in your `.env` file

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

---

## 🧪 Testing Email Delivery with Mailtrap

[Mailtrap](https://mailtrap.io) lets you capture test emails without sending them to real addresses.

1. Create a free account at [mailtrap.io](https://mailtrap.io)
2. In the dashboard, go to **Email Testing → Inboxes**
3. Click your inbox and select the **SMTP** integration tab
4. Copy the credentials into your `.env`:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
```

5. Submit the contact form — emails appear in your Mailtrap inbox within seconds.
6. When ready for production, replace with your real SMTP credentials.

---

## 📁 Project Structure

```
event-management-website/
├── index.html              # Home page (hero, stats, services, portfolio preview, testimonials, newsletter)
├── about.html              # About Us page (story, team, stats, why-choose-us)
├── services.html           # Services page (8 service cards)
├── portfolio.html          # Portfolio page (12 cards with JS category filter)
├── contact.html            # Contact page (enquiry form + Google Maps)
├── README.md               # This file
│
├── assets/
│   ├── css/
│   │   └── style.css       # All custom styles (CSS variables, animations, responsive breakpoints)
│   ├── js/
│   │   └── main.js         # All custom JavaScript (7 init functions)
│   └── images/             # Local images folder (currently using CDN URLs)
│
└── server/
    ├── server.js           # Express app — API endpoints + static file serving
    ├── package.json        # Node.js dependencies
    ├── .env.example        # Environment variable template (safe to commit)
    └── .env                # Your real credentials (DO NOT commit — in .gitignore)
```

---

## 🎨 Customization Guide

### Company Name & Branding
Search and replace `EliteEvents Co.` across all 5 HTML files. It appears in:
- Every `<title>` tag and navbar brand
- Footer brand text
- Meta descriptions

### Color Scheme
Edit the CSS variables at the top of `assets/css/style.css`:
```css
:root {
  --navy: #0d1b2a;       /* Your primary dark color */
  --gold: #c9a84c;       /* Your accent/highlight color */
  --gold-light: #e8c96d;
  --gold-dark: #a8862e;
}
```

### WhatsApp Number
Replace `18005550199` in all HTML files (the `href="https://wa.me/18005550199"` attributes). Include the country code without `+` or spaces.

### Google Maps Location
In `contact.html`, update the iframe `src` attribute:
```html
src="https://maps.google.com/maps?q=YOUR+CITY+AND+STATE&output=embed"
```

### Business Email Destination
Set `BUSINESS_EMAIL` in `server/.env` to your real business email.

### Contact Details
Replace throughout all HTML files:
- Phone: `+1 (800) 555-0199`
- Email: `hello@eliteevents.co`
- Address: `123 Grand Avenue, New York, NY 10001`

---

## 🚢 Production Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
cd server
pm2 start server.js --name "eliteevents"
pm2 startup    # Configure auto-start on system reboot
pm2 save       # Save the current process list
```

Common PM2 commands:
```bash
pm2 status          # Check running processes
pm2 logs eliteevents  # View server logs
pm2 restart eliteevents  # Restart the server
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then add HTTPS with Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Production Environment Variables
On production servers, set environment variables through your hosting provider's dashboard rather than a `.env` file. Also set:
```
NODE_ENV=production
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Markup | HTML5 | — |
| Styling | CSS3 + Bootstrap | 5.3.3 |
| Icons | Bootstrap Icons | 1.11.3 |
| Frontend JS | Vanilla ES6+ | — |
| Backend runtime | Node.js | 18+ |
| Web framework | Express | ^4.19.2 |
| Email delivery | Nodemailer | ^6.9.14 |
| Security | express-rate-limit | ^7.3.1 |
| Config | dotenv | ^16.4.5 |
| CORS | cors | ^2.8.5 |

---

## 📄 License

This project is provided as a customizable template. Replace all placeholder branding, images, and contact details before deploying commercially.

---

*Made with ❤️ for EliteEvents Co.*
