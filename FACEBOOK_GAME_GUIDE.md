# Complete Guide: Building and Deploying Facebook Instant Games

This guide provides a step-by-step walkthrough for building an HTML5 game and deploying it directly to **Facebook Instant Games Hosting**.

---

## 📁 1. Project Directory Structure

Your project folder **must** have `index.html` and `fbapp-config.json` at the root directory level:

```text
my-facebook-game/
├── index.html          <-- Must be at root
├── fbapp-config.json   <-- Must be at root
├── game.js             <-- Main game logic
└── assets/             <-- Images, audio, fonts (optional)
    ├── logo.png
    └── sound.mp3
```

> ⚠️ **CRITICAL RULE FOR ZIP UPLOAD**: When creating the ZIP file for Facebook hosting, zip the **contents** of the folder directly, NOT the outer folder itself. `index.html` MUST sit at the top level inside the `.zip`.

---

## ⚙️ 2. Step 1: Facebook App Configuration (`fbapp-config.json`)

Create a file named `fbapp-config.json` in the root of your project:

```json
{
  "instant_games": {
    "platform_version": "RICH_GAMEPLAY",
    "orientation": "PORTRAIT",
    "navigation_menu_version": "NAV_BAR"
  }
}
```

### Supported Configuration Options:
* `"navigation_menu_version"`: **Mandatory**. Set to `"NAV_BAR"`.
* `"orientation"`: `"PORTRAIT"` (vertical) or `"LANDSCAPE"` (horizontal).
* `"platform_version"`: `"RICH_GAMEPLAY"`.
* `"navigation_bar_color"`: Optional background hex color for the nav bar (e.g. `"#1A1A2E"`).

---

## 📄 3. Step 2: HTML Setup (`index.html`)

The Facebook Instant Games SDK **must** be loaded in the `<head>` of your `index.html` before any other scripts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>My Facebook Game</title>

  <!-- MANDATORY: Facebook Instant Games SDK v6.3 -->
  <script src="https://connect.facebook.net/en_US/fbinstant.6.3.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
    }
    #gameCanvas {
      width: 100vw;
      height: 100vh;
      display: block;
    }
  </style>
</head>
<body>

  <canvas id="gameCanvas"></canvas>

  <script src="game.js"></script>
</body>
</html>
```

---

## 🕹️ 4. Step 3: Facebook SDK Lifecycle in JavaScript (`game.js`)

Your game **must** follow the Facebook SDK lifecycle sequence:
1. `FBInstant.initializeAsync()`
2. `FBInstant.setLoadingProgress(percentage)`
3. `FBInstant.startGameAsync()`

### Production Boilerplate Code:

```javascript
(function () {
  "use strict";

  function startMyGame() {
    console.log("Game started!");
    // Initialize your canvas, input listeners, render loop, etc.
  }

  // Check if running inside Facebook environment
  if (typeof FBInstant !== "undefined") {
    
    // Step 1: Initialize Facebook SDK
    FBInstant.initializeAsync()
      .then(function () {
        // Step 2: Report loading progress (0-100)
        FBInstant.setLoadingProgress(100);

        // Step 3: Tell Facebook loading is done and start game
        return FBInstant.startGameAsync();
      })
      .then(function () {
        // Get Player Info (Optional)
        try {
          var playerName = FBInstant.player.getName();
          console.log("Welcome player:", playerName);
        } catch (e) {}

        // Launch main game loop
        startMyGame();
      })
      .catch(function (error) {
        console.error("Facebook SDK Init Error:", error);
        startMyGame(); // Fallback so game still plays if SDK fails
      });

  } else {
    // Local Browser Fallback (for testing outside Facebook)
    console.log("Running locally outside Facebook.");
    startMyGame();
  }
})();
```

---

## 📦 5. Step 4: Packaging Your Game Bundle

1. Open your project folder.
2. Select all files (`index.html`, `fbapp-config.json`, `game.js`, `assets/`, etc.).
3. Right-click and choose **Compress to ZIP** (or `Send to -> Compressed (zipped) folder`).
4. Name your file `game-bundle.zip`.

### 🚨 Common Packaging Mistakes to Avoid:
* **DO NOT** zip the root folder itself (e.g. zipping `my-facebook-game/` folder will put `index.html` at `my-facebook-game/index.html` inside the zip, causing Facebook deployment to fail).
* Ensure `fbapp-config.json` is valid JSON (no trailing commas or comments).
* Use relative asset paths (e.g., `./assets/image.png` instead of `/assets/image.png` or `C:/...`).

---

## 🚀 6. Step 5: Uploading & Deploying to Facebook Hosting

### Prerequisites:
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create an App $\rightarrow$ Select **Use cases: Instant Games** (or create a custom App and add the **Instant Games** product).

### Upload Steps:
1. Open your App Dashboard at `developers.facebook.com`.
2. Go to **Instant Games** $\rightarrow$ **Hosting** (or **Web Hosting**).
3. Click **Upload Version / Upload Bundle**.
4. Select your `game-bundle.zip`.
5. Wait for Facebook to process and validate the bundle.
6. Once uploaded:
   * Click **Push to Production** (or Stage for testing).
   * Copy the **Test URL** or launch the game directly in **Facebook Messenger / Facebook Mobile App**.

---

## 🛠️ 7. Troubleshooting & Best Practices

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Bundle upload failed"** | `index.html` is missing from the ZIP root, or `fbapp-config.json` is missing/invalid. | Ensure `index.html` and `fbapp-config.json` sit directly at the root level of the ZIP. |
| **"Your instant game doesn't have a production version"** | The uploaded bundle is currently marked as **Staging** (or no version has been published to Production yet). | In Meta App Dashboard $\rightarrow$ **Instant Games** $\rightarrow$ **Hosting**, find your uploaded version, click `...` or status dropdown and select **Push to Production** (or use Local Server Override URL). |
| **Black screen / Game stuck loading** | `FBInstant.startGameAsync()` was never called. | Ensure `FBInstant.setLoadingProgress(100)` and `FBInstant.startGameAsync()` execute cleanly in `game.js`. |
| **Assets failed to load** | Using absolute file paths or external cross-origin links. | Use relative file paths (`./assets/file.png`) and include all images/sounds inside your ZIP bundle. |
| **Mobile layout broken** | Canvas isn't listening to `resize` events or DPR. | Set canvas CSS width/height to `100vw`/`100vh` and update inner canvas width/height using `window.innerWidth * window.devicePixelRatio`. |

---

## 💡 8. Advanced Facebook SDK Features to Add Later

* **Social Share:**
  ```javascript
  FBInstant.shareAsync({
    intent: 'SHARE',
    text: 'I played What Type of American Are You! Can you beat my score?',
    image: base64ImageString
  });
  ```
* **Rewarded Video Ads:**
  ```javascript
  FBInstant.getRewardedVideoAsync('YOUR_PLACEMENT_ID')
    .then(function(rewarded) {
      return rewarded.showAsync();
    });
  ```
