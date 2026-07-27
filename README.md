# 🔐 Secure Password Generator
Live preview:https://ayushman013-amp.github.io/Secure-password-generator-Minor-project1-/

A modern, highly customizable, and responsive Password Generator Web Application built with clean, modular HTML5, CSS3, and Vanilla JavaScript. Designed with a dark blue and purple glassmorphism interface, real-time security entropy calculation, custom slider controls, clipboard copying, and keyboard shortcuts.

Submitted as an **Internship Project**.

---

## 🌟 Features

- **⚡ Dynamic Password Generation**: Uses `window.crypto` for cryptographically strong random character generation and Fisher-Yates array shuffling.
- **🎛️ Real-Time Length Control**: Adjustable slider (length 4 to 30) with real-time feedback and increment/decrement buttons.
- **🔤 Flexible Character Options**:
  - Uppercase Letters (`A-Z`)
  - Lowercase Letters (`a-z`)
  - Numbers (`0-9`)
  - Special Symbols (`!@#$%^&*()_+-=[]{}|;:,.<>?`)
  - Option to exclude ambiguous characters (`i, l, 1, O, 0`) for extra clarity.
- **🛡️ Real-time Security & Entropy Assessment**:
  - Colored badge indicator: **Weak** (Red), **Medium** (Orange), **Strong** (Green), and **Very Strong** (Cyan).
  - 4-segment visual progress meter with glow accents.
  - Password Entropy calculation in bits ($E = L \times \log_2(N)$).
  - Brute-force crack time estimation (from "Instantly" to "Centuries+").
- **📋 One-Click Copy & Toast Notifications**:
  - Copies generated password directly to system clipboard.
  - Interactive "Copied Successfully!" floating toast notification.
- **👁️ Password Visibility Toggle**: Eye button to reveal or mask generated passwords.
- **✨ Micro-Interactions & Animations**:
  - CSS-only button ripple effect.
  - Slot-machine style password shuffle output animation.
  - Ambient glowing background animation with dark blue/purple mesh gradient.
- **♿ Fully Accessible & Keyboard Friendly**:
  - Press `Space` to generate a new password anytime.
  - Press `Ctrl+C` or `Cmd+C` to copy password.
  - Full keyboard `Tab` navigation with visible focus indicators.
- **📱 Fully Responsive**: Seamlessly adapts to Mobile, Tablet, Laptop, and Desktop screens.

---

## 🛠️ Technologies Used

| Technology | Usage / Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure (`<main>`, `<header>`, `<section>`, `<footer>`, `<label>`, `<input>`) |
| **CSS3** | Modern Glassmorphism layout, Custom Range Slider, CSS Variables, Flexbox, Grid, Animations |
| **Vanilla JavaScript (ES6+)** | State management, Cryptographic random generation, Event handling, Clipboard API |
| **Google Fonts** | *Inter* (UI Text) & *JetBrains Mono* (Password Output Field) |

*No external JavaScript frameworks or heavy libraries were used.*

---

## 📁 Folder Structure

```text
PasswordGenerator/
│
├── index.html          # Main HTML structure with semantic tags
├── style.css           # Glassmorphism styling, CSS variables & animations
├── script.js           # Core password logic, entropy math & UI interactions
├── README.md           # Project documentation & setup instructions
└── assets/             # Project screenshots & visual assets
```

---


## 🚀 How to Run

### Method 1: Open Directly in Browser
1. Download or clone this repository to your local machine.
2. Double-click on `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Method 2: Live Server (VS Code Extension)
1. Open the project directory in Visual Studio Code.
2. Right-click `index.html` and click **Open with Live Server**.

### Method 3: Node / Vite Dev Server
```bash
# Install dependencies
npm install

# Start local server on port 3000
npm run dev
```

---

## 🧠 Key JavaScript Functions Overview

| Function Name | Description |
| :--- | :--- |
| `generatePassword()` | Main driver function that collects options, builds character pools, enforces guaranteed characters, and updates output. |
| `copyPassword()` | Handles clipboard interaction via Clipboard API with fallback and shows success notification. |
| `calculateStrength(password, poolSize)` | Computes password entropy bits and determines strength category + brute-force crack estimate. |
| `showNotification(msg, type)` | Triggers floating toast alert with auto-hide timer. |
| `updateLength(newLength)` | Synchronizes slider position, counter badge, and range background fill. |
| `shufflePassword(array)` | Uses Fisher-Yates algorithm with `crypto.getRandomValues()` to eliminate character position predictability. |

---

## 🔮 Future Improvements

- [ ] Add breach database check (HaveIBeenPwned API integration).
- [ ] Add password history log stored in local storage.
- [ ] Add customizable passphrase generator mode (e.g. `correct-horse-battery-staple`).
- [ ] Add export passwords to CSV / JSON feature.

---

## 📄 License & Attribution

Created for **Internship Submission**. Free to use and modify for educational purposes.
