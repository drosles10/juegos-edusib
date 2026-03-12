/* =========================================================
   Necesidad vs Deseo
   Optimizado para pantalla touch Hikvision 65" Android
========================================================= */

const ROUND_SIZE = 10;
const MAX_LIVES = 3;
const IDLE_SECONDS = 60;
const WARNING_SECONDS = 10;

const LEVEL_PLAN = { easy: 4, medium: 3, hard: 3 };

const LEVEL_LABELS = {
  easy: "Fácil",
  medium: "Intermedio",
  hard: "Avanzado"
};

const KIOSK = {
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,
  inputLocked: false,
  lockMs: 350,
  resizeRaf: null,
  fullscreenTried: false
};

const items = [
  { emoji:"💧", name:"Agua", answer:"need", level:"easy", explanation:"Es esencial para vivir y cuidar tu salud." },
  { emoji:"🍎", name:"Comida", answer:"need", level:"easy", explanation:"El alimento es básico para tener energía y bienestar." },
  { emoji:"🏠", name:"Vivienda", answer:"need", level:"easy", explanation:"Necesitas un lugar seguro donde vivir y descansar." },
  { emoji:"🩺", name:"Medicina", answer:"need", level:"easy", explanation:"Sirve para cuidar la salud cuando es necesario." },
  { emoji:"🪥", name:"Cepillo de dientes", answer:"need", level:"easy", explanation:"La higiene personal sí es una necesidad." },
  { emoji:"🧼", name:"Jabón", answer:"need", level:"easy", explanation:"Ayuda a mantener limpieza y salud." },
  { emoji:"📚", name:"Útiles escolares", answer:"need", level:"easy", explanation:"Son importantes para estudiar y aprender." },
  { emoji:"🚍", name:"Transporte", answer:"need", level:"easy", explanation:"Puede ser necesario para ir a estudiar, trabajar o atender responsabilidades." },

  { emoji:"🍦", name:"Helado", answer:"want", level:"easy", explanation:"Es algo rico y divertido, pero no es indispensable." },
  { emoji:"🧸", name:"Juguete", answer:"want", level:"easy", explanation:"Puede gustarte mucho, pero no es esencial." },
  { emoji:"🎮", name:"Videojuego", answer:"want", level:"easy", explanation:"Es entretenimiento, no una necesidad básica." },
  { emoji:"🎢", name:"Parque de diversiones", answer:"want", level:"easy", explanation:"Es recreación, no algo esencial para vivir." },
  { emoji:"🍿", name:"Palomitas del cine", answer:"want", level:"easy", explanation:"Son un gusto, no una necesidad." },

  { emoji:"👟", name:"Zapatos escolares", answer:"need", level:"medium", explanation:"Si son para estudiar o movilizarte, sí cumplen una función necesaria." },
  { emoji:"🌧️", name:"Impermeable para lluvia", answer:"need", level:"medium", explanation:"Puede ser necesario si te protege para ir a clases o al trabajo." },
  { emoji:"🥪", name:"Refacción para el recreo", answer:"need", level:"medium", explanation:"Si sirve para alimentarte durante la jornada, puede ser una necesidad." },
  { emoji:"💡", name:"Electricidad", answer:"need", level:"medium", explanation:"Ayuda con iluminación, estudio y actividades básicas del hogar." },
  { emoji:"🧥", name:"Abrigo", answer:"need", level:"medium", explanation:"Si te protege del frío, cumple una función básica." },
  { emoji:"📶", name:"Internet para tareas", answer:"need", level:"medium", explanation:"Cuando se usa para estudiar o trabajar, puede ser necesario." },

  { emoji:"🎧", name:"Audífonos nuevos", answer:"want", level:"medium", explanation:"Pueden ser útiles, pero normalmente no son indispensables." },
  { emoji:"📺", name:"Televisión nueva", answer:"want", level:"medium", explanation:"Aunque entretiene, no es una necesidad básica." },
  { emoji:"🍕", name:"Pizza a domicilio", answer:"want", level:"medium", explanation:"Es comida, pero en este caso es un gusto y no una necesidad básica." },
  { emoji:"🎁", name:"Regalo extra", answer:"want", level:"medium", explanation:"Es algo bonito, pero no esencial." },
  { emoji:"🚲", name:"Bicicleta para pasear", answer:"want", level:"medium", explanation:"Sirve para diversión o recreación si no es tu medio principal de transporte." },
  { emoji:"🎬", name:"Salida al cine", answer:"want", level:"medium", explanation:"Es entretenimiento, no una necesidad." },

  { emoji:"📱", name:"Celular nuevo si el actual funciona", answer:"want", level:"hard", explanation:"Si tu celular actual todavía sirve, cambiarlo sería más un deseo que una necesidad." },
  { emoji:"👕", name:"Ropa de marca", answer:"want", level:"hard", explanation:"La ropa sí puede ser necesidad, pero pagar de más por la marca es un deseo." },
  { emoji:"🛜", name:"Paquete extra de datos para redes", answer:"want", level:"hard", explanation:"Si es solo para entretenimiento, no es esencial." },
  { emoji:"🎂", name:"Pastel grande para celebración", answer:"want", level:"hard", explanation:"Puede ser especial, pero sigue siendo un deseo." },
  { emoji:"⌚", name:"Reloj inteligente", answer:"want", level:"hard", explanation:"Puede ser útil, pero no es algo básico para vivir o estar bien." },

  { emoji:"👓", name:"Lentes recetados", answer:"need", level:"hard", explanation:"Si fueron recetados para ver bien, sí son una necesidad." },
  { emoji:"🚌", name:"Pasaje para ir a estudiar", answer:"need", level:"hard", explanation:"Si te permite cumplir con una responsabilidad importante, puede ser una necesidad." },
  { emoji:"🍱", name:"Almuerzo para la jornada", answer:"need", level:"hard", explanation:"Alimentarte adecuadamente es una necesidad." },
  { emoji:"🧴", name:"Bloqueador por indicación médica", answer:"need", level:"hard", explanation:"Si se usa por salud o cuidado necesario, sí puede ser una necesidad." },
  { emoji:"🔋", name:"Cargador para el único celular que usas para estudiar", answer:"need", level:"hard", explanation:"Si lo necesitas para comunicarte o estudiar, cumple una función necesaria." }
];

const WOW_MSGS = ["¡Súper! 🌟", "¡Genial! 🎈", "¡Excelente! 🏆", "¡Muy bien! ✨", "¡Lo lograste! 🎉"];

/* ===== DOM ===== */
const card = document.getElementById("card");
const need = document.getElementById("need");
const want = document.getElementById("want");
const msg = document.getElementById("msg");
const scorePill = document.getElementById("scorePill");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const emojiEl = document.getElementById("emoji");
const titleEl = document.getElementById("title");
const subtitleEl = document.querySelector(".subtitle");

const confettiCanvas = document.getElementById("confetti");
const winScreen = document.getElementById("winScreen");
const winScore = document.getElementById("winScore");
const winSubtitle = document.getElementById("winSubtitle");
const playAgainBtn = document.getElementById("playAgainBtn");
const livesEl = document.getElementById("lives");

const winTitle = document.querySelector(".win-title");
const winEmoji = document.querySelector(".win-emoji");

const roundText = document.getElementById("roundText");
const progressFill = document.getElementById("progressFill");

const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

const idleOverlay = document.getElementById("idleOverlay");
const idleCountText = document.getElementById("idleCountText");

/* ===== Estado ===== */
let deck = [];
let roundIndex = 0;
let score = 0;
let lives = MAX_LIVES;
let streak = 0;
let bestStreak = 0;
let locked = false;
let overlayMode = "start";

let dragging = false;
let startX = 0;
let startY = 0;
let curX = 0;
let curY = 0;

let audioCtx = null;
let idleTimer = null;
let idleCountdown = IDLE_SECONDS;
let idleWarningShown = false;

/* ===== Util ===== */
function shuffle(arr){
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeTap(handler, delay = KIOSK.lockMs){
  return function wrapped(event){
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (KIOSK.inputLocked) return;
    KIOSK.inputLocked = true;

    try {
      handler(event);
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      KIOSK.inputLocked = false;
    }, delay);
  };
}

function setRealViewportHeight(){
  const realHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const vh = realHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

function fitGameToScreen(){
  const ww = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const wh = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const scaleX = ww / KIOSK.BASE_WIDTH;
  const scaleY = wh / KIOSK.BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty("--game-scale", String(scale));
}

function forceReflowResize(){
  setRealViewportHeight();
  fitGameToScreen();
  resizeConfetti();

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
    resizeConfetti();
  }, 120);

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
    resizeConfetti();
  }, 450);
}

function handleResizeOptimized(){
  if (KIOSK.resizeRaf) {
    cancelAnimationFrame(KIOSK.resizeRaf);
  }

  KIOSK.resizeRaf = requestAnimationFrame(() => {
    forceReflowResize();
  });
}

function blockProblematicGestures(){
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

async function enterFullscreen(){
  try {
    const target = document.documentElement;

    if (document.fullscreenElement) {
      forceReflowResize();
      return true;
    }

    if (target.requestFullscreen) {
      await target.requestFullscreen({ navigationUI: "hide" });
      forceReflowResize();
      return true;
    }

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
      forceReflowResize();
      return true;
    }

    return false;
  } catch (error) {
    console.warn("No se pudo activar pantalla completa:", error);
    forceReflowResize();
    return false;
  }
}

function updateFullscreenButton(){
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = document.fullscreenElement
    ? "🡼 Salir pantalla completa"
    : "⛶ Pantalla completa";
}

function tryFullscreenOnce(){
  if (KIOSK.fullscreenTried) return;
  KIOSK.fullscreenTried = true;
  enterFullscreen().finally(() => {
    updateFullscreenButton();
    forceReflowResize();
  });
}

function pickLevelCards(level, count){
  return shuffle(items.filter((item) => item.level === level)).slice(0, count);
}

function buildDeck(){
  const selected = [
    ...pickLevelCards("easy", LEVEL_PLAN.easy),
    ...pickLevelCards("medium", LEVEL_PLAN.medium),
    ...pickLevelCards("hard", LEVEL_PLAN.hard)
  ];

  return shuffle(selected).slice(0, ROUND_SIZE);
}

function getLevelChip(level){
  const label = LEVEL_LABELS[level] || "Nivel";
  return `<span class="chip chip-goal">${label}</span>`;
}

function getStreakText(){
  if (streak >= 5) return `🔥 Racha imparable x${streak}`;
  if (streak >= 3) return `⚡ Racha x${streak}`;
  if (streak === 2) return `✨ Llevas 2 seguidas`;
  return "";
}

function getMedal(scoreValue, bestStreakValue, livesValue){
  if (scoreValue >= 9 && bestStreakValue >= 4 && livesValue >= 2) {
    return {
      emoji: "🥇",
      title: "Maestro de decisiones inteligentes",
      message: "Clasificaste excelente y mantuviste una gran racha."
    };
  }

  if (scoreValue >= 7) {
    return {
      emoji: "🥈",
      title: "Buen administrador",
      message: "Vas muy bien identificando necesidades y deseos."
    };
  }

  return {
    emoji: "🥉",
    title: "Aprendiz financiero",
    message: "Ya entiendes la idea; una partida más y mejoras todavía más."
  };
}

/* ===== Audio ===== */
function ensureAudio(){
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function tone({ freq = 440, duration = 0.10, type = "sine", gain = 0.05, when = 0 }){
  ensureAudio();
  const t0 = audioCtx.currentTime + when;

  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.start(t0);
  osc.stop(t0 + duration);
}

function soundCorrect(){
  tone({ freq: 740, duration: 0.08, type: "sine", gain: 0.06, when: 0.00 });
  tone({ freq: 988, duration: 0.10, type: "sine", gain: 0.06, when: 0.09 });
  tone({ freq: 1175, duration: 0.12, type: "sine", gain: 0.05, when: 0.19 });
}

function soundWrong(){
  tone({ freq: 240, duration: 0.12, type: "triangle", gain: 0.05, when: 0.00 });
  tone({ freq: 180, duration: 0.20, type: "triangle", gain: 0.05, when: 0.10 });
}

function soundWin(){
  const notes = [784, 880, 988, 1175, 1319];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.10, type: "sine", gain: 0.06, when: i * 0.10 }));
  setTimeout(() => tone({ freq: 1568, duration: 0.14, type: "sine", gain: 0.06, when: 0.00 }), 520);
}

function startMusic(){
  if (!bgMusic) return;
  bgMusic.volume = 0.18;
  bgMusic.play().catch(() => {});
}

function updateMuteButton(){
  if (!muteBtn || !bgMusic) return;
  muteBtn.textContent = bgMusic.muted ? "🔇 Música" : "🔊 Música";
}

/* ===== UI ===== */
function clearZoneStates(){
  [need, want].forEach((z) => z.classList.remove("active", "good", "bad"));
}

function resetCardPosition(){
  curX = 0;
  curY = 0;
  card.style.setProperty("--x", "0px");
  card.style.setProperty("--y", "0px");
  card.style.setProperty("--rot", "0deg");
}

function updateScore(){
  const streakLabel = streak > 1 ? ` • Racha: ${streak}` : "";
  scorePill.textContent = `Puntos: ${score}${streakLabel}`;
}

function updateProgress(){
  if (roundText) {
    roundText.textContent = `Tarjeta ${roundIndex + 1}/${ROUND_SIZE}`;
  }

  if (!progressFill) return;
  const pct = ((roundIndex + 1) / ROUND_SIZE) * 100;
  progressFill.style.width = `${pct}%`;
  progressFill.classList.add("flash");
  setTimeout(() => progressFill.classList.remove("flash"), 300);
}

function setCard(it){
  emojiEl.textContent = it.emoji;
  titleEl.textContent = it.name;

  if (subtitleEl) {
    subtitleEl.innerHTML = `¿Es una necesidad o un deseo? • ${getLevelChip(it.level)}`;
  }

  updateProgress();
  msg.textContent = "";
  msg.className = "msg";

  clearZoneStates();
  resetCardPosition();
}

function renderLives(){
  if (!livesEl) return;
  const hearts = livesEl.querySelectorAll(".heart");
  hearts.forEach((heart, i) => {
    if (i < lives) {
      heart.classList.add("on");
      heart.classList.remove("off");
    } else {
      heart.classList.add("off");
      heart.classList.remove("on");
    }
  });
}

function zoneFromPoint(x, y){
  const zones = [need, want];
  for (const z of zones) {
    const r = z.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
  }
  return null;
}

function highlightZone(z){
  clearZoneStates();
  if (z) z.classList.add("active");
}

function snapBack(){
  card.classList.remove("grabbed");
  card.style.transition = "transform 160ms ease";
  resetCardPosition();
  setTimeout(() => {
    card.style.transition = "";
  }, 180);
}

function showResponseMessage({ ok, item, choice }){
  const selectedText = choice === "need" ? "Necesidad" : "Deseo";
  const correctText = item.answer === "need" ? "Necesidad" : "Deseo";
  const levelChip = getLevelChip(item.level);
  const streakText = getStreakText();
  const wow = WOW_MSGS[Math.floor(Math.random() * WOW_MSGS.length)];

  if (ok) {
    msg.className = "msg good pop";
    msg.innerHTML = `
      <strong>${wow}</strong> ${levelChip}<br>
      <span>${item.name} va en <strong>${correctText}</strong>. ${item.explanation}</span>
      ${streakText ? `<br><strong>${streakText}</strong>` : ""}
    `;
    return;
  }

  msg.className = "msg bad pop";
  msg.innerHTML = `
    <strong>Casi…</strong> La marcaste como <strong>${selectedText}</strong>, pero va en <strong>${correctText}</strong>.<br>
    <span>${item.explanation}</span>
  `;
}

/* ===== Overlay ===== */
function openOverlay(isStart = false){
  winScreen.classList.add("show");
  if (isStart) {
    winScreen.classList.add("start");
  } else {
    winScreen.classList.remove("start");
  }
  winScreen.setAttribute("aria-hidden", "false");
  forceReflowResize();
}

function closeOverlay(){
  winScreen.classList.remove("show", "start");
  winScreen.setAttribute("aria-hidden", "true");
}

function setOverlayVictory(){
  const medal = getMedal(score, bestStreak, lives);

  if (winEmoji) winEmoji.textContent = medal.emoji;
  if (winTitle) winTitle.textContent = "¡Felicidades!";

  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box win-box">
        <div class="start-line">
          <span class="badge">${medal.emoji} ${medal.title}</span>
        </div>

        <div class="start-steps">
          <div class="step">
            <span class="step-ico">⭐</span>
            <div><b>Puntaje:</b> <span class="chip chip-goal">${score}/${ROUND_SIZE}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">🔥</span>
            <div><b>Mejor racha:</b> <span class="chip chip-life">${bestStreak}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">🏅</span>
            <div><b>Medalla:</b> ${medal.message}</div>
          </div>

          <div class="step">
            <span class="step-ico">💡</span>
            <div><b>Recuerda:</b> una necesidad es esencial; un deseo es algo que quieres, pero no es indispensable.</div>
          </div>
        </div>

        <div class="start-tip">¡Excelente trabajo! Sigue practicando tus decisiones financieras. 🎈</div>
      </div>
    `;
  }

  if (winScore) {
    winScore.textContent = `Puntos: ${score}/${ROUND_SIZE} • Mejor racha: ${bestStreak}`;
    winScore.style.display = "";
  }

  if (playAgainBtn) playAgainBtn.textContent = "Jugar de nuevo 🚀";
}

function showGameOver(){
  const medal = getMedal(score, bestStreak, lives);

  locked = true;
  overlayMode = "lose";

  if (winEmoji) winEmoji.textContent = "💔";
  if (winTitle) winTitle.textContent = "¡Ups!";

  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box">
        <div class="start-line">
          <span class="badge">${medal.emoji} ${medal.title}</span>
        </div>

        <div class="start-steps">
          <div class="step">
            <span class="step-ico">⭐</span>
            <div><b>Puntaje:</b> <span class="chip chip-goal">${score}/${ROUND_SIZE}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">🔥</span>
            <div><b>Mejor racha:</b> <span class="chip chip-life">${bestStreak}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">💡</span>
            <div>${medal.message}</div>
          </div>

          <div class="step">
            <span class="step-ico">🧠</span>
            <div><b>Tip:</b> piensa si el artículo es esencial para vivir, estudiar, trabajar o cuidar tu salud.</div>
          </div>
        </div>
      </div>
    `;
  }

  if (winScore) {
    winScore.textContent = `Puntos: ${score}/${ROUND_SIZE} • Mejor racha: ${bestStreak}`;
    winScore.style.display = "";
  }

  if (playAgainBtn) playAgainBtn.textContent = "Intentar de nuevo";

  openOverlay(false);
}

function showStartScreen(){
  locked = true;
  overlayMode = "start";

  if (winEmoji) winEmoji.textContent = "💡";
  if (winTitle) winTitle.textContent = "¿Lo Necesito o lo Deseo?";

  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box">
        <div class="start-line">
          <span class="badge">🏦 Superintendencia de Bancos</span>
        </div>

        <div class="start-steps">
          <div class="step"><span class="step-ico">1️⃣</span> Arrastra la tarjeta a <span class="chip chip-need">Necesidad</span> o <span class="chip chip-want">Deseo</span>.</div>
          <div class="step"><span class="step-ico">2️⃣</span> Algunas tarjetas son <span class="chip chip-goal">Fáciles</span>, otras <span class="chip chip-goal">Intermedias</span> y otras <span class="chip chip-goal">Avanzadas</span>.</div>
          <div class="step"><span class="step-ico">3️⃣</span> Tienes <span class="chip chip-life">3 vidas ❤️</span> y puedes lograr rachas seguidas para lucirte.</div>
          <div class="step"><span class="step-ico">4️⃣</span> Completa <span class="chip chip-goal">10 tarjetas</span> y gana tu medalla final 🏅.</div>
        </div>

        <div class="start-tip">Tip: piensa si es algo esencial o si solo lo quieres.</div>
      </div>
    `;
  }

  if (winScore) winScore.style.display = "none";
  if (playAgainBtn) playAgainBtn.textContent = "▶ Iniciar juego";

  openOverlay(true);
}

/* ===== Juego ===== */
function startRound(){
  overlayMode = "playing";
  closeOverlay();

  if (winScore) winScore.style.display = "";

  locked = false;
  score = 0;
  streak = 0;
  bestStreak = 0;
  lives = MAX_LIVES;
  roundIndex = 0;
  deck = buildDeck();

  renderLives();
  updateScore();
  setCard(deck[roundIndex]);
  resetIdle();
  forceReflowResize();
}

function endRound(){
  locked = true;
  setOverlayVictory();
  openOverlay(false);

  soundWin();
  launchConfetti({ count: 320, ms: 2400, spread: 12 });

  const bg = document.querySelector(".bg-fair");
  if (bg) {
    bg.classList.add("celebrate");
    setTimeout(() => bg.classList.remove("celebrate"), 2000);
  }
}

function currentCard(){
  return deck[roundIndex];
}

function goNext(){
  roundIndex += 1;
  if (roundIndex >= deck.length) {
    endRound();
    return;
  }

  setTimeout(() => {
    setCard(deck[roundIndex]);
  }, 520);
}

function checkDrop(choice){
  if (locked) return;

  const item = currentCard();
  const ok = choice === item.answer;
  const zone = choice === "need" ? need : want;

  clearZoneStates();
  zone.classList.add(ok ? "good" : "bad");

  if (ok) {
    score += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    updateScore();
    showResponseMessage({ ok: true, item, choice });
    soundCorrect();
    launchConfetti({ count: 120, ms: 850, spread: 7 });

    locked = true;
    setTimeout(() => {
      locked = false;
      goNext();
    }, 1150);
    return;
  }

  streak = 0;
  updateScore();
  showResponseMessage({ ok: false, item, choice });
  soundWrong();

  lives -= 1;
  renderLives();

  if (lives <= 0) {
    setTimeout(() => {
      msg.className = "msg bad";
      msg.textContent = "¡Se acabaron las vidas! 💔";
      showGameOver();
    }, 950);
    return;
  }

  setTimeout(() => snapBack(), 700);
}

/* ===== Confeti ===== */
const confetti = { parts: [], tEnd: 0 };

function resizeConfetti(){
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  confettiCanvas.width = Math.floor(confettiCanvas.clientWidth * dpr);
  confettiCanvas.height = Math.floor(confettiCanvas.clientHeight * dpr);
  const ctx = confettiCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchConfetti(opts = {}){
  resizeConfetti();
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;

  const count = opts.count ?? 140;
  const ms = opts.ms ?? 900;
  const spread = opts.spread ?? 7;

  for (let i = 0; i < count; i += 1) {
    confetti.parts.push({
      x: w * 0.5,
      y: h * 0.22,
      vx: (Math.random() * 2 - 1) * spread,
      vy: Math.random() * -1 * (spread + 2) - spread * 0.6,
      g: 0.22 + Math.random() * 0.18,
      s: 6 + Math.random() * 10,
      r: Math.random() * Math.PI,
      vr: (Math.random() * 2 - 1) * 0.22,
      life: 90 + Math.random() * 70,
      hue: Math.floor(Math.random() * 360)
    });
  }

  confetti.tEnd = performance.now() + ms;
  requestAnimationFrame(confettiStep);
}

function confettiStep(){
  const ctx = confettiCanvas.getContext("2d");
  const now = performance.now();
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  confetti.parts = confetti.parts.filter((p) => p.life > 0);
  for (const p of confetti.parts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.r += p.vr;
    p.life -= 1;

    if (p.y > h + 20) p.life = 0;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = `hsla(${p.hue}, 92%, 60%, 0.92)`;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.65);
    ctx.restore();
  }

  if (now < confetti.tEnd || confetti.parts.length > 0) {
    requestAnimationFrame(confettiStep);
  } else {
    ctx.clearRect(0, 0, w, h);
  }
}

/* ===== Drag ===== */
card.addEventListener("pointerdown", (e) => {
  if (locked || winScreen.classList.contains("show")) return;

  dragging = true;
  card.setPointerCapture(e.pointerId);
  card.classList.add("grabbed");

  startX = e.clientX - curX;
  startY = e.clientY - curY;
  resetIdle();
});

card.addEventListener("pointermove", (e) => {
  if (!dragging) return;

  curX = e.clientX - startX;
  curY = e.clientY - startY;

  const rot = Math.max(-10, Math.min(10, curX / 25));
  card.style.setProperty("--x", `${curX}px`);
  card.style.setProperty("--y", `${curY}px`);
  card.style.setProperty("--rot", `${rot}deg`);

  const z = zoneFromPoint(e.clientX, e.clientY);
  highlightZone(z);
});

card.addEventListener("pointerup", (e) => {
  if (!dragging) return;
  dragging = false;
  card.classList.remove("grabbed");

  const z = zoneFromPoint(e.clientX, e.clientY);
  clearZoneStates();

  if (!z) {
    snapBack();
    return;
  }

  checkDrop(z.dataset.choice);
  resetIdle();
});

card.addEventListener("pointercancel", () => {
  dragging = false;
  clearZoneStates();
  snapBack();
});

/* ===== Inactividad ===== */
function hideIdleOverlay(){
  idleOverlay.classList.add("hidden");
  idleOverlay.setAttribute("aria-hidden", "true");
}

function showIdleOverlay(seconds){
  idleCountText.textContent = String(seconds);
  idleOverlay.classList.remove("hidden");
  idleOverlay.setAttribute("aria-hidden", "false");
}

function returnToStartFromIdle(){
  hideIdleOverlay();
  showStartScreen();
}

function resetIdle(){
  idleCountdown = IDLE_SECONDS;
  idleWarningShown = false;
  hideIdleOverlay();

  if (idleTimer) {
    clearInterval(idleTimer);
  }

  idleTimer = setInterval(() => {
    idleCountdown -= 1;

    if (idleCountdown <= WARNING_SECONDS && !idleWarningShown) {
      idleWarningShown = true;
      showIdleOverlay(idleCountdown);
    }

    if (idleCountdown <= WARNING_SECONDS) {
      idleCountText.textContent = String(Math.max(0, idleCountdown));
    }

    if (idleCountdown <= 0) {
      clearInterval(idleTimer);
      returnToStartFromIdle();
    }
  }, 1000);
}

/* ===== Eventos generales ===== */
function setupGeneralActivityListeners(){
  const activityEvents = ["click", "touchstart", "pointerdown", "mousemove", "keydown"];

  activityEvents.forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => {
        resetIdle();
      },
      { passive: true }
    );
  });
}

function preloadAssets(){
  [
    "assets/Global.png",
    "assets/edusib.png",
    "assets/avatarnina.png"
  ].forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  });
}

/* ===== Botones ===== */
resetBtn.addEventListener("click", safeTap(() => {
  startRound();
}));

fullscreenBtn.addEventListener("click", safeTap(async () => {
  await enterFullscreen();
  updateFullscreenButton();
  resetIdle();
  forceReflowResize();
}));

playAgainBtn.addEventListener("click", safeTap(() => {
  startRound();
}));

muteBtn.addEventListener("click", safeTap(() => {
  if (!bgMusic) return;
  bgMusic.muted = !bgMusic.muted;
  updateMuteButton();
  resetIdle();
}));

document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

/* ===== Init ===== */
function init(){
  blockProblematicGestures();
  preloadAssets();
  updateFullscreenButton();
  updateMuteButton();
  renderLives();
  updateScore();
  resizeConfetti();
  forceReflowResize();
  setupGeneralActivityListeners();
  showStartScreen();
  resetIdle();

  document.addEventListener(
    "pointerdown",
    () => {
      tryFullscreenOnce();
      ensureAudio();
      startMusic();
    },
    { once: true, passive: true }
  );

  window.addEventListener("resize", handleResizeOptimized, { passive: true });
  window.addEventListener("orientationchange", handleResizeOptimized, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      forceReflowResize();
      resetIdle();
    }
  });

  setTimeout(forceReflowResize, 120);
  setTimeout(forceReflowResize, 500);
  setTimeout(forceReflowResize, 900);
}

document.addEventListener("DOMContentLoaded", init);