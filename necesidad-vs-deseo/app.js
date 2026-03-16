const ROUND_SIZE = 10;
const EASY_COUNT = 4;
const INTERMEDIATE_COUNT = 3;
const HARD_COUNT = 3;

const FEEDBACK_MS = 2200;
const IDLE_SECONDS = 120;
const WARNING_SECONDS = 10;

const ITEMS = [
  // FÁCIL
  {
    emoji: "💧",
    name: "Agua",
    answer: "need",
    level: "easy",
    explanation: "El agua es una necesidad porque es esencial para vivir y mantener la salud."
  },
  {
    emoji: "🍎",
    name: "Comida",
    answer: "need",
    level: "easy",
    explanation: "La comida es una necesidad porque el cuerpo la necesita para tener energía y estar sano."
  },
  {
    emoji: "🏠",
    name: "Vivienda",
    answer: "need",
    level: "easy",
    explanation: "La vivienda es una necesidad porque brinda protección y un lugar seguro para vivir."
  },
  {
    emoji: "🩺",
    name: "Medicina",
    answer: "need",
    level: "easy",
    explanation: "La medicina es una necesidad porque ayuda a cuidar la salud cuando una persona está enferma."
  },
  {
    emoji: "📚",
    name: "Útiles escolares",
    answer: "need",
    level: "easy",
    explanation: "Los útiles escolares son una necesidad porque ayudan a aprender y realizar tareas."
  },
  {
    emoji: "🍦",
    name: "Helado",
    answer: "want",
    level: "easy",
    explanation: "El helado es un deseo porque es algo rico o agradable, pero no es indispensable."
  },
  {
    emoji: "🧸",
    name: "Juguete",
    answer: "want",
    level: "easy",
    explanation: "Un juguete es un deseo porque entretiene, pero no es esencial para vivir."
  },
  {
    emoji: "🎮",
    name: "Videojuego",
    answer: "want",
    level: "easy",
    explanation: "Un videojuego es un deseo porque sirve para diversión, no para una necesidad básica."
  },
  {
    emoji: "🎢",
    name: "Parque de diversiones",
    answer: "want",
    level: "easy",
    explanation: "Ir a un parque de diversiones es un deseo porque es entretenimiento y no algo esencial."
  },
  {
    emoji: "📺",
    name: "Televisión nueva",
    answer: "want",
    level: "easy",
    explanation: "Una televisión nueva suele ser un deseo porque no es indispensable para vivir o estudiar."
  },

  // INTERMEDIO
  {
    emoji: "📶",
    name: "WiFi para tareas y clases",
    answer: "need",
    level: "intermediate",
    explanation: "En este caso se considera necesidad porque sirve para estudiar, recibir clases y hacer tareas."
  },
  {
    emoji: "🎒",
    name: "Mochila escolar",
    answer: "need",
    level: "intermediate",
    explanation: "La mochila escolar es una necesidad porque ayuda a llevar materiales para aprender."
  },
  {
    emoji: "👟",
    name: "Zapatos para ir al colegio",
    answer: "need",
    level: "intermediate",
    explanation: "Se consideran necesidad porque ayudan a asistir al colegio de manera adecuada y segura."
  },
  {
    emoji: "🚌",
    name: "Transporte para estudiar",
    answer: "need",
    level: "intermediate",
    explanation: "Es una necesidad porque permite llegar al lugar de estudio o trabajo."
  },
  {
    emoji: "🧼",
    name: "Jabón",
    answer: "need",
    level: "intermediate",
    explanation: "El jabón es una necesidad porque forma parte de la higiene y cuidado de la salud."
  },
  {
    emoji: "🎧",
    name: "Audífonos premium",
    answer: "want",
    level: "intermediate",
    explanation: "Son un deseo porque, aunque pueden gustar mucho, no son esenciales."
  },
  {
    emoji: "👕",
    name: "Ropa de marca",
    answer: "want",
    level: "intermediate",
    explanation: "La ropa puede ser necesidad, pero que sea de marca ya entra más en deseo."
  },
  {
    emoji: "🎁",
    name: "Regalo caro",
    answer: "want",
    level: "intermediate",
    explanation: "Es un deseo porque no es indispensable para vivir, estudiar o cuidar la salud."
  },
  {
    emoji: "📱",
    name: "Servicio de streaming",
    answer: "want",
    level: "intermediate",
    explanation: "Es un deseo porque es para entretenimiento y no una necesidad básica."
  },
  {
    emoji: "🕹️",
    name: "Consola de videojuegos",
    answer: "want",
    level: "intermediate",
    explanation: "Es un deseo porque se usa para diversión y no es esencial."
  },

  // DIFÍCIL
  {
    emoji: "💻",
    name: "Laptop para estudiar",
    answer: "need",
    level: "hard",
    explanation: "En este contexto se considera necesidad porque ayuda a estudiar, investigar y realizar tareas."
  },
  {
    emoji: "📞",
    name: "Celular para emergencias",
    answer: "need",
    level: "hard",
    explanation: "Aquí se considera necesidad porque permite comunicarse en situaciones importantes o urgentes."
  },
  {
    emoji: "🧥",
    name: "Abrigo para el frío",
    answer: "need",
    level: "hard",
    explanation: "Se considera necesidad porque protege la salud en clima frío."
  },
  {
    emoji: "🥪",
    name: "Refacción saludable para la escuela",
    answer: "need",
    level: "hard",
    explanation: "Es necesidad porque ayuda a alimentarse bien y tener energía durante la jornada."
  },
  {
    emoji: "📱",
    name: "Celular nuevo si el otro aún funciona",
    answer: "want",
    level: "hard",
    explanation: "Es un deseo porque ya existe otro que cumple su función."
  },
  {
    emoji: "📲",
    name: "Internet solo para ver series",
    answer: "want",
    level: "hard",
    explanation: "En este caso es deseo porque se usaría únicamente para entretenimiento."
  },
  {
    emoji: "📺",
    name: "Tablet solo para entretenimiento",
    answer: "want",
    level: "hard",
    explanation: "Es un deseo porque el uso planteado no es esencial."
  },
  {
    emoji: "👟",
    name: "Zapatos extra de moda",
    answer: "want",
    level: "hard",
    explanation: "Un par extra por moda se considera deseo, no una necesidad."
  },
  {
    emoji: "✈️",
    name: "Viaje de vacaciones",
    answer: "want",
    level: "hard",
    explanation: "Es un deseo porque es agradable, pero no indispensable."
  }
];

const WOW_MSGS = [
  "¡Súper! 🌟",
  "¡Genial! 🎈",
  "¡Excelente! 🏆",
  "¡Muy bien! ✨",
  "¡Lo lograste! 🎉"
];

const STREAK_MSGS = {
  2: "¡Vas muy bien! 🔥",
  3: "¡Racha x3! 🚀",
  5: "¡Racha increíble! 🌟",
  7: "¡Imparable! 🏅"
};

const LEVEL_LABELS = {
  easy: "Fácil",
  intermediate: "Intermedio",
  hard: "Difícil"
};

// ===== DOM =====
const card = document.getElementById("card");
const need = document.getElementById("need");
const want = document.getElementById("want");
const msg = document.getElementById("msg");
const scorePill = document.getElementById("scorePill");
const streakPill = document.getElementById("streakPill");
const levelPill = document.getElementById("levelPill");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const menuBtn = document.getElementById("menuBtn");
const menuBtnOverlay = document.getElementById("menuBtnOverlay");
const muteBtn = document.getElementById("muteBtn");

const emojiEl = document.getElementById("emoji");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const difficultyChip = document.getElementById("difficultyChip");

const confettiCanvas = document.getElementById("confetti");
const winScreen = document.getElementById("winScreen");
const winScore = document.getElementById("winScore");
const playAgainBtn = document.getElementById("playAgainBtn");
const winTitle = document.querySelector(".win-title");
const winSubtitle = document.querySelector(".win-subtitle");
const winEmoji = document.querySelector(".win-emoji");

const roundText = document.getElementById("roundText");
const progressFill = document.getElementById("progressFill");
const livesEl = document.getElementById("lives");
const bgMusic = document.getElementById("bgMusic");

// ===== Estado =====
let deck = [];
let roundIndex = 0;
let score = 0;
let lives = 3;
const MAX_LIVES = 3;

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
let firstInteractionDone = false;

// ===== Inactividad =====
let idleTimer = null;
let idleCountdown = IDLE_SECONDS;

const idleOverlay = document.createElement("div");
idleOverlay.id = "idleOverlay";
idleOverlay.innerHTML = `
  <div class="idle-box">
    <h2>Sesión inactiva</h2>
    <p>Volviendo al menú principal en <span id="idleCountText">${WARNING_SECONDS}</span> segundos...</p>
  </div>
`;
document.body.appendChild(idleOverlay);

const idleCountText = document.getElementById("idleCountText");

// ===== Utils =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickByLevel(level, count) {
  return shuffle(ITEMS.filter((item) => item.level === level)).slice(0, count);
}

function buildRoundDeck() {
  return shuffle([
    ...pickByLevel("easy", EASY_COUNT),
    ...pickByLevel("intermediate", INTERMEDIATE_COUNT),
    ...pickByLevel("hard", HARD_COUNT)
  ]);
}

function currentCard() {
  return deck[roundIndex];
}

function goToMainMenu() {
  window.location.href = "../index.html";
}

// ===== Audio =====
function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function tone({ freq = 440, duration = 0.1, type = "sine", gain = 0.05, when = 0 }) {
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

function soundCorrect() {
  tone({ freq: 740, duration: 0.08, type: "sine", gain: 0.06, when: 0.0 });
  tone({ freq: 988, duration: 0.1, type: "sine", gain: 0.06, when: 0.09 });
  tone({ freq: 1175, duration: 0.12, type: "sine", gain: 0.05, when: 0.19 });
}

function soundWrong() {
  tone({ freq: 240, duration: 0.12, type: "triangle", gain: 0.05, when: 0.0 });
  tone({ freq: 180, duration: 0.2, type: "triangle", gain: 0.05, when: 0.1 });
}

function soundWin() {
  const notes = [784, 880, 988, 1175, 1319];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.1, type: "sine", gain: 0.06, when: i * 0.1 }));
  setTimeout(() => tone({ freq: 1568, duration: 0.14, type: "sine", gain: 0.06, when: 0.0 }), 520);
}

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.18;
  bgMusic.play().catch(() => {});
}

// ===== UI =====
function clearZoneStates() {
  [need, want].forEach((z) => z.classList.remove("active", "good", "bad"));
}

function resetCardPosition() {
  curX = 0;
  curY = 0;
  card.style.setProperty("--x", "0px");
  card.style.setProperty("--y", "0px");
  card.style.setProperty("--rot", "0deg");
}

function renderLives() {
  const hearts = livesEl.querySelectorAll(".heart");
  hearts.forEach((h, i) => {
    if (i < lives) {
      h.classList.add("on");
      h.classList.remove("off");
    } else {
      h.classList.add("off");
      h.classList.remove("on");
    }
  });
}

function updateScore() {
  scorePill.textContent = `Puntos: ${score}`;
}

function updateStreak() {
  streakPill.textContent = `Racha: ${streak}`;
}

function updateLevel() {
  const item = currentCard();
  if (!item) return;

  const label = LEVEL_LABELS[item.level];
  levelPill.textContent = `Nivel: ${label}`;
  difficultyChip.textContent = label;
  difficultyChip.className = `difficulty-chip ${item.level}`;
}

function updateProgress() {
  const item = currentCard();
  if (!item) return;

  const label = LEVEL_LABELS[item.level];
  roundText.textContent = `Tarjeta ${roundIndex + 1}/${ROUND_SIZE} • Nivel: ${label}`;
  progressFill.style.width = `${((roundIndex + 1) / ROUND_SIZE) * 100}%`;

  progressFill.classList.add("flash");
  setTimeout(() => progressFill.classList.remove("flash"), 300);
}

function setCard(item) {
  emojiEl.textContent = item.emoji;
  titleEl.textContent = item.name;
  subtitleEl.textContent = "¿Es una necesidad o un deseo?";

  clearZoneStates();
  resetCardPosition();
  updateProgress();
  updateLevel();

  msg.textContent = "";
  msg.className = "msg";
}

function zoneFromPoint(x, y) {
  const zones = [need, want];
  for (const z of zones) {
    const r = z.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
  }
  return null;
}

function highlightZone(z) {
  clearZoneStates();
  if (z) z.classList.add("active");
}

function snapBack() {
  card.classList.remove("grabbed");
  card.style.transition = "transform 160ms ease";
  resetCardPosition();
  setTimeout(() => {
    card.style.transition = "";
  }, 180);
}

function showFeedback({ ok, text, extra = "" }) {
  msg.className = `msg ${ok ? "good" : "bad"} feedback-box pop`;
  msg.innerHTML = `
    <div class="feedback-title">${text}</div>
    ${extra ? `<div class="feedback-text">${extra}</div>` : ""}
  `;
}

function getStreakMessage() {
  return STREAK_MSGS[streak] || WOW_MSGS[Math.floor(Math.random() * WOW_MSGS.length)];
}

// ===== Pantallas =====
function setOverlayVictory() {
  if (winEmoji) winEmoji.textContent = "🎉";
  if (winTitle) winTitle.textContent = "¡Felicidades!";

  let performanceText = "Sigue practicando";
  if (score >= 8) performanceText = "¡Excelente criterio!";
  else if (score >= 5) performanceText = "¡Buen trabajo!";

  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box win-box">
        <div class="start-line">
          <span class="badge">🏆 ${performanceText}</span>
        </div>

        <div class="start-steps">
          <div class="step">
            <span class="step-ico">⭐</span>
            <div><b>Puntaje final:</b> <span class="chip chip-goal">${score}/${ROUND_SIZE}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">🔥</span>
            <div><b>Mejor racha:</b> <span class="chip chip-need">${bestStreak}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">💡</span>
            <div>
              <b>Recuerda:</b> una <span class="chip chip-need">Necesidad</span> es algo esencial para vivir, estudiar, trabajar o cuidar la salud;
              un <span class="chip chip-want">Deseo</span> es algo que te gustaría tener, pero no es indispensable.
            </div>
          </div>

          <div class="step">
            <span class="step-ico">🛒</span>
            <div><b>Antes de comprar, pregúntate:</b> “¿De verdad lo necesito o solo lo deseo?”</div>
          </div>
        </div>

        <div class="start-tip">¡Sigue tomando decisiones inteligentes! 🎈</div>
      </div>
    `;
  }

  playAgainBtn.textContent = "Jugar de nuevo 🚀";
}

function showGameOver() {
  locked = true;
  overlayMode = "lose";

  if (winEmoji) winEmoji.textContent = "💔";
  if (winTitle) winTitle.textContent = "¡Se acabaron las vidas!";
  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box">
        <div class="start-steps">
          <div class="step">
            <span class="step-ico">🟩</span>
            <div><strong>Necesidad:</strong> algo esencial para vivir, estudiar, trabajar o cuidar la salud.</div>
          </div>
          <div class="step">
            <span class="step-ico">🟥</span>
            <div><strong>Deseo:</strong> algo que quieres, pero no es indispensable.</div>
          </div>
          <div class="step">
            <span class="step-ico">🔥</span>
            <div><strong>Mejor racha:</strong> ${bestStreak}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (winScore) {
    winScore.textContent = `Puntos: ${score}/${ROUND_SIZE}`;
    winScore.style.display = "";
  }

  playAgainBtn.textContent = "Intentar de nuevo";
  winScreen.classList.add("show");
  winScreen.classList.remove("start");
  winScreen.setAttribute("aria-hidden", "false");
}

function showStartScreen() {
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
          <div class="step">
            <span class="step-ico">1️⃣</span>
            <div>Arrastra la tarjeta a <span class="chip chip-need">Necesidad</span> o <span class="chip chip-want">Deseo</span>.</div>
          </div>

          <div class="step">
            <span class="step-ico">2️⃣</span>
            <div>Tendrás tarjetas de nivel <span class="chip chip-goal">Fácil</span>, <span class="chip chip-goal">Intermedio</span> y <span class="chip chip-goal">Difícil</span>.</div>
          </div>

          <div class="step">
            <span class="step-ico">3️⃣</span>
            <div>Haz <span class="chip chip-life">racha de aciertos 🔥</span> y completa <span class="chip chip-goal">10 tarjetas</span>.</div>
          </div>

          <div class="step">
            <span class="step-ico">4️⃣</span>
            <div>Tienes <span class="chip chip-life">3 vidas ❤️</span>. Después de cada respuesta recibirás una explicación.</div>
          </div>
        </div>

        <div class="start-tip">Tip: piensa si es algo esencial o si solo lo deseas.</div>
      </div>
    `;
  }

  if (winScore) winScore.style.display = "none";
  playAgainBtn.textContent = "Iniciar";

  winScreen.classList.add("show", "start");
  winScreen.setAttribute("aria-hidden", "false");
}

function startRound() {
  overlayMode = "playing";
  locked = false;

  winScreen.classList.remove("show", "start");
  winScreen.setAttribute("aria-hidden", "true");

  if (winScore) winScore.style.display = "";

  score = 0;
  lives = MAX_LIVES;
  roundIndex = 0;
  streak = 0;
  bestStreak = 0;

  deck = buildRoundDeck();

  updateScore();
  updateStreak();
  renderLives();
  setCard(deck[roundIndex]);
}

function endRound() {
  locked = true;
  overlayMode = "win";

  setOverlayVictory();

  if (winScore) {
    winScore.textContent = `Puntos: ${score}/${ROUND_SIZE}`;
    winScore.style.display = "";
  }

  winScreen.classList.add("show");
  winScreen.classList.remove("start");
  winScreen.setAttribute("aria-hidden", "false");

  soundWin();
  launchConfetti({ count: 320, ms: 2400, spread: 12 });

  const bg = document.querySelector(".bg-fair");
  if (bg) {
    bg.classList.add("celebrate");
    setTimeout(() => bg.classList.remove("celebrate"), 2000);
  }
}

// ===== Confeti =====
const confetti = { parts: [], tEnd: 0 };

function resizeConfetti() {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  confettiCanvas.width = Math.floor(confettiCanvas.clientWidth * dpr);
  confettiCanvas.height = Math.floor(confettiCanvas.clientHeight * dpr);
  const ctx = confettiCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeConfetti, { passive: true });

function launchConfetti(opts = {}) {
  resizeConfetti();
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;

  const count = opts.count ?? 140;
  const ms = opts.ms ?? 900;
  const spread = opts.spread ?? 7;

  for (let i = 0; i < count; i++) {
    confetti.parts.push({
      x: w * 0.5,
      y: h * 0.22,
      vx: (Math.random() * 2 - 1) * spread,
      vy: (Math.random() * -1) * (spread + 2) - (spread * 0.6),
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

function confettiStep() {
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

// ===== Juego =====
function goNext() {
  roundIndex += 1;

  if (roundIndex >= ROUND_SIZE) {
    endRound();
    return;
  }

  locked = false;
  setCard(deck[roundIndex]);
}

function checkDrop(choice) {
  if (locked) return;

  const item = currentCard();
  const ok = choice === item.answer;
  const chosenZone = choice === "need" ? need : want;
  const correctZone = item.answer === "need" ? need : want;

  clearZoneStates();

  if (ok) {
    chosenZone.classList.add("good");
    score += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);

    updateScore();
    updateStreak();
    soundCorrect();
    launchConfetti({ count: 110, ms: 850, spread: 7 });

    const streakText = getStreakMessage();
    showFeedback({
      ok: true,
      text: `${streakText}`,
      extra: `${item.name}: ${item.explanation}`
    });
  } else {
    chosenZone.classList.add("bad");
    correctZone.classList.add("good");

    lives -= 1;
    streak = 0;

    renderLives();
    updateStreak();
    soundWrong();

    showFeedback({
      ok: false,
      text: `No era esa opción ❌`,
      extra: `${item.name}: ${item.explanation}`
    });
  }

  snapBack();
  locked = true;

  if (lives <= 0) {
    setTimeout(() => {
      showGameOver();
    }, FEEDBACK_MS);
    return;
  }

  setTimeout(() => {
    goNext();
  }, FEEDBACK_MS);
}

// ===== Drag =====
card.addEventListener("pointerdown", (e) => {
  if (locked || winScreen.classList.contains("show")) return;

  dragging = true;
  card.setPointerCapture(e.pointerId);
  card.classList.add("grabbed");

  startX = e.clientX - curX;
  startY = e.clientY - curY;
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
});

card.addEventListener("pointercancel", () => {
  dragging = false;
  clearZoneStates();
  snapBack();
});

// ===== Fullscreen =====
async function goFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    console.warn("No se pudo activar pantalla completa:", err);
  }
}

async function toggleFullscreen(event) {
  try {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn("No se pudo cambiar a pantalla completa:", err);
  }
}

function updateFullscreenButton() {
  fullscreenBtn.textContent = document.fullscreenElement
    ? "🡼 Salir pantalla completa"
    : "⛶ Pantalla completa";
}

function handleFirstInteraction() {
  if (firstInteractionDone) return;
  firstInteractionDone = true;
  ensureAudio();
  startMusic();
  goFullscreen();
}

fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
updateFullscreenButton();

// ===== Botones =====
resetBtn.addEventListener("click", startRound);
playAgainBtn.addEventListener("click", startRound);
menuBtn.addEventListener("click", goToMainMenu);
menuBtnOverlay.addEventListener("click", goToMainMenu);

if (muteBtn) {
  muteBtn.addEventListener("click", () => {
    if (!bgMusic) return;
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇 Música" : "🔊 Música";
  });
}

// ===== Inactividad =====
function hideIdleOverlay() {
  idleOverlay.classList.remove("show");
}

function showIdleOverlay() {
  idleOverlay.classList.add("show");
}

function resetIdleTimer() {
  idleCountdown = IDLE_SECONDS;
  hideIdleOverlay();

  if (idleTimer) {
    clearInterval(idleTimer);
  }

  idleTimer = setInterval(() => {
    idleCountdown -= 1;

    if (idleCountdown <= WARNING_SECONDS && idleCountdown > 0) {
      showIdleOverlay();
      idleCountText.textContent = idleCountdown;
    }

    if (idleCountdown <= 0) {
      clearInterval(idleTimer);
      goToMainMenu();
    }
  }, 1000);
}

function setupIdleDetection() {
  const events = [
    "click",
    "touchstart",
    "touchmove",
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "pointerdown"
  ];

  events.forEach((eventName) => {
    document.addEventListener(eventName, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
}

// ===== Inicio =====
showStartScreen();
setupIdleDetection();