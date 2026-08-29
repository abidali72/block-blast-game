/* ============================================================
   GAME.JS — "What Type of American Are You?" US Personality Quiz
   Facebook Instant Game (HTML5 Canvas + Web Audio API)
   ============================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------
     GLOBAL STATE & CONFIG
     -------------------------------------------------------- */
  var canvas, ctx, W, H, dpr;
  var playerName = "Friend";
  var currentScreen = "loading"; // loading | title | quiz | result
  var soundEnabled = true;
  var animFrame = 0;

  /* Quiz state */
  var currentQuestion = 0;
  var scores = { classic: 0, coastal: 0, heartland: 0, southern: 0, freeSpirit: 0 };
  var selectedAnswer = -1;
  var answerLocked = false;

  /* Input state */
  var touchButtons = [];

  /* Web Audio Context */
  var audioCtx = null;

  /* Visual effects */
  var particles = [];
  var stars = [];
  var resultType = null;
  var titlePulse = 0;
  var resultAnim = 0;

  /* --------------------------------------------------------
     10 US TRIVIA & PERSONALITY QUESTIONS (Targeted for US Women 35+)
     -------------------------------------------------------- */
  var questions = [
    {
      q: "It's Saturday morning! What's your ideal routine?",
      a: [
        { text: "Fresh coffee & neighborhood farmers market", type: "heartland" },
        { text: "Brunch with my best girlfriends downtown", type: "coastal" },
        { text: "Cooking a big breakfast for the family", type: "classic" },
        { text: "Spontaneous road trip — bags packed!", type: "freeSpirit" }
      ]
    },
    {
      q: "Pick your dream American getaway destination:",
      a: [
        { text: "Cozy mountain cabin in the Rockies", type: "heartland" },
        { text: "Luxury weekend shopping in New York", type: "coastal" },
        { text: "Historic porch & beach in Charleston, SC", type: "southern" },
        { text: "Camping under stars at Yellowstone", type: "freeSpirit" }
      ]
    },
    {
      q: "What's your ultimate comfort food?",
      a: [
        { text: "Baked macaroni & cheese from scratch", type: "classic" },
        { text: "Avocado toast with everything bagel seasoning", type: "coastal" },
        { text: "Grandma's secret fried chicken recipe", type: "southern" },
        { text: "Fresh warm apple pie with vanilla ice cream", type: "heartland" }
      ]
    },
    {
      q: "Your ideal Friday evening looks like:",
      a: [
        { text: "Fun game night with neighbors and friends", type: "heartland" },
        { text: "Trying that new trendy rooftop restaurant", type: "coastal" },
        { text: "Porch swing, sweet tea, watching fireflies", type: "southern" },
        { text: "Backyard BBQ & campfire storytelling", type: "classic" }
      ]
    },
    {
      q: "Which vehicle matches your personality?",
      a: [
        { text: "A reliable, heavy-duty pickup truck", type: "heartland" },
        { text: "A sleek electric luxury SUV", type: "coastal" },
        { text: "A classic red Mustang convertible", type: "classic" },
        { text: "A converted camper van ready to travel", type: "freeSpirit" }
      ]
    },
    {
      q: "What core value do you treasure most?",
      a: [
        { text: "Family traditions & patriotic heritage", type: "classic" },
        { text: "Personal growth & inspiring adventures", type: "freeSpirit" },
        { text: "Community spirit & helping neighbors", type: "heartland" },
        { text: "Warm hospitality, grace & good manners", type: "southern" }
      ]
    },
    {
      q: "What playlist keeps you smiling on a drive?",
      a: [
        { text: "Classic 90s Country hits", type: "southern" },
        { text: "Acoustic folk & indie anthems", type: "freeSpirit" },
        { text: "Today's top 40 pop hits", type: "coastal" },
        { text: "Classic 70s & 80s Rock legends", type: "classic" }
      ]
    },
    {
      q: "How would you describe your home decor?",
      a: [
        { text: "Warm & cozy rustic farmhouse style", type: "heartland" },
        { text: "Clean, modern minimalist aesthetic", type: "coastal" },
        { text: "Red, white & blue patriotic touches", type: "classic" },
        { text: "Vintage thrifted items with unique stories", type: "freeSpirit" }
      ]
    },
    {
      q: "What quality do you value most in a true friend?",
      a: [
        { text: "Unwavering loyalty through thick and thin", type: "classic" },
        { text: "Deep heart-to-heart conversations", type: "freeSpirit" },
        { text: "Always ready with sweet tea and warm advice", type: "southern" },
        { text: "Someone who keeps life fun & exciting", type: "coastal" }
      ]
    },
    {
      q: "Which iconic motto speaks to your soul?",
      a: [
        { text: "\"Home is where the heart is\"", type: "heartland" },
        { text: "\"Live free, dream big\"", type: "freeSpirit" },
        { text: "\"Bless your heart & smile\"", type: "southern" },
        { text: "\"Work hard, play hard\"", type: "coastal" }
      ]
    }
  ];

  /* --------------------------------------------------------
     PERSONALITY RESULTS
     -------------------------------------------------------- */
  var results = {
    classic: {
      title: "The Classic Patriot 🇺🇸",
      emoji: "🇺🇸",
      color: "#D64045",
      gradient: ["#D64045", "#1B3A5C"],
      desc: "You are the heart and soul of America! You treasure family, tradition, and patriotic celebrations. Your home is welcoming, your apple pie is famous, and you bring everyone together with warmth and pride.",
      share: "I'm The Classic Patriot! 🇺🇸 Take the quiz to see what type of American you are!"
    },
    coastal: {
      title: "The Coastal Trendsetter ✨",
      emoji: "✨",
      color: "#6C63FF",
      gradient: ["#6C63FF", "#E91E84"],
      desc: "You have your finger on the pulse of culture! Ambitious, stylish, and vibrant, you love discovering trendy cafes, staying active, and creating beautiful memories with great friends.",
      share: "I'm The Coastal Trendsetter! ✨ Take the quiz to see what type of American you are!"
    },
    heartland: {
      title: "The Heartland Hero 🌻",
      emoji: "🌻",
      color: "#F4A236",
      gradient: ["#F4A236", "#E85D26"],
      desc: "Salt of the earth! Community is everything to you, and neighbors know they can always rely on your helping hand. Your warm smile and cozy kitchen make everyone feel right at home.",
      share: "I'm The Heartland Hero! 🌻 Take the quiz to see what type of American you are!"
    },
    southern: {
      title: "The Southern Charmer 🍑",
      emoji: "🍑",
      color: "#E8836B",
      gradient: ["#E8836B", "#F4C95D"],
      desc: "Grace, hospitality, and pure charm! You prove that kindness is a superpower. Your sweet tea is legendary, your porch is always open, and your gentle spirit brightens every room.",
      share: "I'm The Southern Charmer! 🍑 Take the quiz to see what type of American you are!"
    },
    freeSpirit: {
      title: "The Free Spirit 🦋",
      emoji: "🦋",
      color: "#2EC4B6",
      gradient: ["#2EC4B6", "#3A86FF"],
      desc: "Adventure calls and you answer! Independent, creative, and open-minded, you love exploring America's natural wonders, making new friends, and marching to the beat of your own drum.",
      share: "I'm The Free Spirit! 🦋 Take the quiz to see what type of American you are!"
    }
  };

  /* --------------------------------------------------------
     CANVAS & RESPONSIVE SETUP
     -------------------------------------------------------- */
  function setupCanvas() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* --------------------------------------------------------
     SOUND EFFECTS (Pure Web Audio API — No External Files)
     -------------------------------------------------------- */
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type, vol) {
    if (!soundEnabled) return;
    try {
      var ac = getAudioCtx();
      if (ac.state === "suspended") {
        ac.resume();
      }
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration);
    } catch (e) {}
  }

  function playClick() { playTone(800, 0.06, "square", 0.06); }
  function playSelect() {
    playTone(523, 0.08, "sine", 0.1);
    setTimeout(function () { playTone(659, 0.08, "sine", 0.1); }, 70);
  }
  function playResult() {
    var notes = [523, 659, 784, 1047];
    notes.forEach(function (n, i) {
      setTimeout(function () { playTone(n, 0.2, "sine", 0.08); }, i * 140);
    });
  }

  /* --------------------------------------------------------
     PARTICLES & BACKGROUND VISUALS
     -------------------------------------------------------- */
  function initStars() {
    stars = [];
    for (var i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStars() {
    stars.forEach(function (s) {
      s.twinkle += 0.02;
      var alpha = 0.25 + Math.sin(s.twinkle) * 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.fill();
    });
  }

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < (count || 12); i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 3 + 1;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.025 + 0.015,
        r: Math.random() * 4 + 2,
        color: color
      });
    }
  }

  function updateParticles() {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    particles.forEach(function (p) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* --------------------------------------------------------
     CANVAS DRAWING UTILITIES
     -------------------------------------------------------- */
  function drawGradientBG(c1, c2) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    var lines = [];
    for (var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        lines.push(line.trim());
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    var startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (var j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], x, startY + j * lineHeight);
    }
    return lines.length;
  }

  function drawButton(x, y, w, h, text, color, textColor, id, radius) {
    var r = radius || 16;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    roundRect(x, y, w, h, r);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = textColor || "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var fontSize = Math.min(w / text.length * 1.5, h * 0.4, 20);
    ctx.font = "bold " + Math.max(14, fontSize) + "px sans-serif";
    wrapText(text, x + w / 2, y + h / 2, w - 20, Math.max(14, fontSize) + 4);

    touchButtons.push({ x: x, y: y, w: w, h: h, id: id });
  }

  function drawSoundButton() {
    var size = 44;
    var x = W - size - 16;
    var y = 16;
    var r = size / 2;

    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();

    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(soundEnabled ? "🔊" : "🔇", x + r, y + r);

    touchButtons.push({ x: x, y: y, w: size, h: size, id: "sound" });
  }

  /* --------------------------------------------------------
     SCREEN RENDERERS
     -------------------------------------------------------- */
  function drawLoadingScreen() {
    drawGradientBG("#1a1a2e", "#16213e");
    drawStars();
  }

  function drawTitleScreen() {
    drawGradientBG("#1a1a2e", "#0f3460");
    drawStars();
    titlePulse += 0.03;

    var cy = H * 0.16;

    /* Big Icon */
    var scale = 1 + Math.sin(titlePulse) * 0.04;
    ctx.save();
    ctx.translate(W / 2, cy);
    ctx.scale(scale, scale);
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🇺🇸", 0, 0);
    ctx.restore();

    /* Title */
    cy += 65;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    wrapText("What Type of American Are You?", W / 2, cy, W - 40, 32);

    /* Subtitle */
    cy += 55;
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText("Take our 10-question personality quiz!", W / 2, cy);

    /* Player Welcome */
    cy += 38;
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#FFC857";
    ctx.fillText("Welcome, " + playerName + "! 👋", W / 2, cy);

    /* Big Start Button */
    var btnW = Math.min(280, W - 48);
    var btnH = 60;
    var btnX = (W - btnW) / 2;
    var btnY = cy + 48;

    drawButton(btnX, btnY, btnW, btnH, "✨ Start Quiz ✨", "#E91E63", "#ffffff", "start", 20);

    drawSoundButton();
  }

  function drawQuizScreen() {
    drawGradientBG("#0f3460", "#1a1a2e");
    drawStars();

    var q = questions[currentQuestion];

    /* Progress indicator */
    var progY = 24;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Question " + (currentQuestion + 1) + " of " + questions.length, W / 2, progY);

    /* Progress bar */
    var barW = W - 60;
    var barH = 8;
    var barX = 30;
    var barY = progY + 12;
    roundRect(barX, barY, barW, barH, 4);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fill();

    var fillW = Math.max(8, barW * ((currentQuestion + 1) / questions.length));
    roundRect(barX, barY, fillW, barH, 4);
    ctx.fillStyle = "#FFC857";
    ctx.fill();

    /* Question Card */
    var cardX = 16;
    var cardY = barY + 24;
    var cardW = W - 32;
    var cardH = 95;

    roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = "center";
    wrapText(q.q, W / 2, cardY + cardH / 2, cardW - 24, 22);

    /* Answer Buttons */
    var btnW = W - 36;
    var btnH = 56;
    var btnGap = 12;
    var startY = cardY + cardH + 20;
    var answerColors = ["#6C63FF", "#E91E63", "#2EC4B6", "#F4A236"];

    for (var i = 0; i < q.a.length; i++) {
      var bx = 18;
      var by = startY + i * (btnH + btnGap);
      var isSelected = selectedAnswer === i;
      var color = isSelected ? answerColors[i] : "rgba(255,255,255,0.12)";

      roundRect(bx, by, btnW, btnH, 14);
      ctx.fillStyle = color;
      ctx.fill();

      if (!isSelected) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "15px sans-serif";
      ctx.textAlign = "center";
      wrapText(q.a[i].text, bx + btnW / 2, by + btnH / 2, btnW - 24, 19);

      if (!answerLocked) {
        touchButtons.push({ x: bx, y: by, w: btnW, h: btnH, id: "answer_" + i });
      }
    }

    drawSoundButton();
    drawParticles();
  }

  function drawResultScreen() {
    if (!resultType) return;
    var r = results[resultType];
    resultAnim += 0.02;

    drawGradientBG(r.gradient[0], r.gradient[1]);
    drawStars();

    var cy = H * 0.05;

    /* Emoji */
    var scale = 1 + Math.sin(resultAnim) * 0.06;
    ctx.save();
    ctx.translate(W / 2, cy + 36);
    ctx.scale(scale, scale);
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(r.emoji, 0, 0);
    ctx.restore();

    cy += 84;

    /* Player intro */
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(playerName + ", your personality result is:", W / 2, cy);

    cy += 32;

    /* Title */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    wrapText(r.title, W / 2, cy, W - 40, 32);

    cy += 38;

    /* Description Box */
    var cardX = 20;
    var cardW = W - 40;
    var cardH = 140;

    roundRect(cardX, cy, cardW, cardH, 16);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    wrapText(r.desc, W / 2, cy + cardH / 2, cardW - 28, 20);

    cy += cardH + 20;

    /* Buttons */
    var btnW = Math.min(260, W - 50);
    var btnH = 50;
    var btnX = (W - btnW) / 2;

    drawButton(btnX, cy, btnW, btnH, "📢 Share Result", "#ffffff", r.gradient[0], "share", 25);
    cy += btnH + 12;

    drawButton(btnX, cy, btnW, btnH, "🔄 Play Again", "rgba(255,255,255,0.2)", "#ffffff", "replay", 25);
    cy += btnH + 12;

    drawButton(btnX, cy, btnW, btnH, "🎁 Watch Ad for Bonus", "rgba(255,255,255,0.12)", "rgba(255,255,255,0.8)", "rewardedAd", 25);

    drawSoundButton();
    drawParticles();
  }

  /* --------------------------------------------------------
     RESULT COMPUTATION
     -------------------------------------------------------- */
  function computeResult() {
    var maxScore = -1;
    var winner = "classic";
    for (var key in scores) {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        winner = key;
      }
    }
    return winner;
  }

  /* --------------------------------------------------------
     INPUT & BUTTON HANDLING
     -------------------------------------------------------- */
  function handleInput(x, y) {
    for (var i = 0; i < touchButtons.length; i++) {
      var b = touchButtons[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        onButtonClick(b.id, b);
        return;
      }
    }
  }

  function onButtonClick(id, btn) {
    if (id === "sound") {
      soundEnabled = !soundEnabled;
      playClick();
      return;
    }

    if (id === "start") {
      playSelect();

      // INTERSTITIAL AD HERE
      showInterstitialAd();

      currentScreen = "quiz";
      currentQuestion = 0;
      selectedAnswer = -1;
      answerLocked = false;
      scores = { classic: 0, coastal: 0, heartland: 0, southern: 0, freeSpirit: 0 };
      spawnParticles(W / 2, H / 2, "#FFC857", 20);
      return;
    }

    if (id.indexOf("answer_") === 0 && !answerLocked) {
      var ansIdx = parseInt(id.split("_")[1]);
      selectedAnswer = ansIdx;
      answerLocked = true;
      playSelect();

      var q = questions[currentQuestion];
      scores[q.a[ansIdx].type]++;
      spawnParticles(btn.x + btn.w / 2, btn.y + btn.h / 2, "#FFC857", 10);

      setTimeout(function () {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          selectedAnswer = -1;
          answerLocked = false;
        } else {
          resultType = computeResult();

          // INTERSTITIAL AD HERE
          showInterstitialAd();

          currentScreen = "result";
          playResult();
          spawnParticles(W / 2, H * 0.3, results[resultType].color, 30);
        }
      }, 500);
      return;
    }

    if (id === "share") {
      playClick();
      shareResult();
      return;
    }

    if (id === "replay") {
      playClick();
      currentScreen = "title";
      resultType = null;
      spawnParticles(W / 2, H / 2, "#2EC4B6", 15);
      return;
    }

    if (id === "rewardedAd") {
      playClick();

      // REWARDED AD HERE
      showRewardedAd();
      return;
    }
  }

  /* --------------------------------------------------------
     FACEBOOK INSTANT GAMES ADS & SHARING
     -------------------------------------------------------- */
  function showInterstitialAd() {
    if (typeof FBInstant === "undefined") return;
    // INTERSTITIAL AD HERE
    try {
      FBInstant.getInterstitialAdAsync('YOUR_PLACEMENT_ID')
        .then(function(interstitial) {
          return interstitial.loadAsync();
        })
        .then(function(interstitial) {
          return interstitial.showAsync();
        })
        .catch(function(e) {
          console.log("Interstitial ad skipped:", e.message);
        });
    } catch(e) {}
  }

  function showRewardedAd() {
    if (typeof FBInstant === "undefined") return;
    // REWARDED AD HERE
    try {
      FBInstant.getRewardedVideoAsync('YOUR_PLACEMENT_ID')
        .then(function(rewarded) {
          return rewarded.loadAsync();
        })
        .then(function(rewarded) {
          return rewarded.showAsync();
        })
        .then(function() {
          console.log("Rewarded ad completed!");
        })
        .catch(function(e) {
          console.log("Rewarded ad skipped:", e.message);
        });
    } catch(e) {}
  }

  function shareResult() {
    if (!resultType) return;
    var r = results[resultType];

    if (typeof FBInstant !== "undefined") {
      /* Generate canvas preview image */
      var oc = document.createElement("canvas");
      oc.width = 600;
      oc.height = 315;
      var octx = oc.getContext("2d");

      var g = octx.createLinearGradient(0, 0, 600, 315);
      g.addColorStop(0, r.gradient[0]);
      g.addColorStop(1, r.gradient[1]);
      octx.fillStyle = g;
      octx.fillRect(0, 0, 600, 315);

      octx.fillStyle = "#ffffff";
      octx.font = "bold 36px sans-serif";
      octx.textAlign = "center";
      octx.fillText(r.title, 300, 130);

      octx.font = "22px sans-serif";
      octx.fillStyle = "rgba(255,255,255,0.85)";
      octx.fillText("What Type of American Are You?", 300, 190);
      octx.fillText("Take the quiz to find out!", 300, 225);

      var dataURL = oc.toDataURL("image/png");

      FBInstant.shareAsync({
        intent: "SHARE",
        image: dataURL,
        text: r.share,
        data: { myReplayData: "quiz_result" }
      }).catch(function (e) {
        console.log("Share skipped:", e);
      });
    }
  }

  /* --------------------------------------------------------
     MAIN GAME LOOP
     -------------------------------------------------------- */
  function gameLoop() {
    animFrame++;
    touchButtons = [];

    switch (currentScreen) {
      case "loading":
        drawLoadingScreen();
        break;
      case "title":
        drawTitleScreen();
        break;
      case "quiz":
        drawQuizScreen();
        break;
      case "result":
        drawResultScreen();
        break;
    }

    updateParticles();
    requestAnimationFrame(gameLoop);
  }

  /* --------------------------------------------------------
     INPUT LISTENERS
     -------------------------------------------------------- */
  function addInputListeners() {
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      var rect = canvas.getBoundingClientRect();
      handleInput(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener("click", function (e) {
      var rect = canvas.getBoundingClientRect();
      handleInput(e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  /* --------------------------------------------------------
     MANDATORY FACEBOOK INSTANT GAMES SDK INITIALIZATION FLOW
     -------------------------------------------------------- */
  function initGame() {
    setupCanvas();
    initStars();
    addInputListeners();
    gameLoop();

    var splash = document.getElementById("splash");
    var splashText = document.getElementById("splash-text");
    var splashFill = document.getElementById("splash-bar-fill");

    function updateProgressUI(pct) {
      if (splashText) splashText.innerText = "Loading Quiz... " + Math.floor(pct) + "%";
      if (splashFill) splashFill.style.width = pct + "%";
    }

    function runSimulatedLoad(onComplete) {
      var pct = 0;
      var interval = setInterval(function () {
        pct += 25;
        if (pct > 100) pct = 100;
        updateProgressUI(pct);
        if (pct >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 80);
    }

    function hideSplash() {
      if (splash) {
        splash.classList.add("hidden");
        setTimeout(function () {
          if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
        }, 500);
      }
    }

    /* Standard Facebook Instant Games Initialization Chain */
    if (typeof FBInstant !== "undefined") {
      FBInstant.initializeAsync()
        .then(function () {
          FBInstant.setLoadingProgress(100);
          updateProgressUI(100);
          return FBInstant.startGameAsync();
        })
        .then(function () {
          try {
            var name = FBInstant.player.getName();
            if (name) playerName = name.split(" ")[0];
          } catch (e) {}
          hideSplash();
          currentScreen = "title";
        })
        .catch(function (e) {
          console.error("FBInstant init error:", e);
          runSimulatedLoad(function () {
            hideSplash();
            currentScreen = "title";
          });
        });
    } else {
      runSimulatedLoad(function () {
        hideSplash();
        currentScreen = "title";
      });
    }
  }

  /* Kick off application when DOM is ready */
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initGame();
  } else {
    window.addEventListener("DOMContentLoaded", initGame);
  }

})();
