# 🎮 Block Blast / What Type of American Are You? — Instant Game

A high-performance, interactive **Facebook Instant Game** built with pure HTML5 Canvas, modern Vanilla JavaScript, and the Web Audio API.

---

## 🌟 Overview

**"What Type of American Are You?"** is an engaging, vibrant personality quiz designed specifically for web and Facebook Instant Games platforms. It features smooth canvas animations, dynamic particle physics, synthesized audio feedback, and seamless integration with the Facebook Instant Games SDK (v6.3).

---

## ✨ Features

- **⚡ Lightweight & Fast**: Pure HTML5 Canvas & Vanilla JS with zero external framework dependencies for instantaneous loading.
- **📱 Universal Responsiveness**: Auto-scales to any viewport (mobile phones, tablets, desktop) with high-DPI (Retina) display support.
- **🎵 Procedural Audio FX**: Built-in Web Audio API sound synthesizer for responsive clicks, chime chords, celebration fanfare, and toggleable mute.
- **✨ Dynamic Visual Effects**: Real-time particle explosions, floating confetti, starbursts, and smooth state transitions.
- **🌐 Facebook Instant Games SDK v6.3 Ready**:
  - `FBInstant.initializeAsync()` & `FBInstant.startGameAsync()` lifecycle management.
  - Native loading progress tracking.
  - Automatic fallback mode for local browser testing outside of Facebook.
- **📊 Detailed Personality Profiling**: 10 curated questions mapping across 5 distinct American archetypes (Heartland, Coastal, Classic, Southern, Free Spirit) with tailored shareable results.

---

## 📁 Project Structure

```text
├── index.html               # Entry point with FB Instant Games SDK v6.3 & canvas setup
├── game.js                  # Core game logic, state machine, rendering loop, & audio engine
├── fbapp-config.json        # Facebook Instant Games manifest configuration
├── FACEBOOK_GAME_GUIDE.md   # Complete step-by-step Facebook deployment & publishing guide
├── README.md                # Project documentation
├── game-bundle.zip          # Pre-packaged production bundle ready for Facebook Hosting
└── assets/                  # Game icons and image assets
    ├── app_icon_1024x1024.png
    ├── icon.png
    └── README.txt
```

---

## 🚀 Getting Started (Run Locally)

You can run and test this game locally in any modern web browser without needing Facebook's environment.

### Option 1: Using Python HTTP Server

```bash
# Python 3
python -m http.server 8080
```
Open your browser and navigate to: [http://localhost:8080](http://localhost:8080)

### Option 2: Using Node.js `http-server` / `serve`

```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

---

## 📦 How to Package for Facebook Instant Games

1. Select all root files and directories:
   - `index.html`
   - `game.js`
   - `fbapp-config.json`
   - `assets/`
2. Create a `.zip` archive ensuring `index.html` sits directly at the root of the ZIP file (do NOT zip the parent folder).
3. The resulting archive (`game-bundle.zip`) is ready for direct upload to Facebook Hosting.

---

## 🌐 Deploying to Facebook Instant Games

For comprehensive deployment instructions, refer to [FACEBOOK_GAME_GUIDE.md](FACEBOOK_GAME_GUIDE.md).

### Quick Steps:
1. Log in to [Meta for Developers](https://developers.facebook.com/).
2. Create an App with the **Instant Games** use case.
3. In the sidebar, navigate to **Instant Games** $\rightarrow$ **Hosting**.
4. Upload `game-bundle.zip`.
5. Once processed, push the uploaded version to **Production** or **Staging** for testing in Messenger.

---

## 🛠️ Tech Stack

- **Markup**: HTML5
- **Rendering**: 2D HTML5 Canvas API
- **Scripting**: Modern Vanilla JavaScript (ES6+)
- **Audio**: Web Audio API (real-time synthesizer)
- **SDK**: Facebook Instant Games SDK v6.3

---

## 📄 License

This project is licensed under the **MIT License**.
