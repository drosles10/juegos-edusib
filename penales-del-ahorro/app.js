/* =========================================================
   Penales del Ahorro
   Optimizado para pantalla Hikvision 65" Android touch
   Ajuste visual: separar claramente animación de GOL vs ATAJADA
   Mejora: atajada conecta mejor con los guantes
   Mejora: texto GOOOL mejor centrado
========================================================= */

const TOTAL_SHOTS = 5;
const IDLE_SECONDS = 30;

const KIOSK = {
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,
  inputLocked: false,
  lockMs: 420,
  idleTimer: null,
  idleLeft: IDLE_SECONDS,
  fullscreenTried: false,
  resizeRaf: null
};

const QUESTIONS = [
  {
    topic: "Ahorro",
    q: "Recibes un ingreso extra inesperado. ¿Qué es lo mejor?",
    choices: [
      { title: "Ahorrar una parte y definir una meta", desc: "Te ayuda a construir estabilidad financiera.", correct: true, target: "left" },
      { title: "Gastar todo porque me lo merezco", desc: "Puede dejarte sin respaldo para el futuro.", correct: false, target: "right" },
      { title: "Prestarlo sin anotarlo", desc: "Podrías perder el control de tu dinero.", correct: false, target: "center" }
    ],
    teach: "Separar una parte del dinero para ahorro es una buena práctica financiera. Tener metas claras de ahorro te permite prepararte para el futuro y enfrentar imprevistos."
  },
  {
    topic: "Presupuesto",
    q: "Al inicio del mes, ¿qué te conviene hacer con tu dinero?",
    choices: [
      { title: "Hacer un presupuesto", desc: "Te permite planificar ingresos y gastos.", correct: true, target: "center" },
      { title: "Gastar y ver si alcanza", desc: "Puede generar problemas financieros.", correct: false, target: "left" },
      { title: "Comprar primero lo más caro", desc: "Puede desordenar tus prioridades.", correct: false, target: "right" }
    ],
    teach: "Un presupuesto te ayuda a organizar tu dinero, identificar en qué gastas y planificar cuánto puedes ahorrar o gastar cada mes."
  },
  {
    topic: "Crédito",
    q: "Antes de comprar algo a cuotas debes revisar:",
    choices: [
      { title: "La tasa, comisiones y costo total", desc: "Te permite saber cuánto pagarás realmente.", correct: true, target: "right" },
      { title: "Solo la cuota mensual", desc: "Puede parecer barato pero no lo es.", correct: false, target: "center" },
      { title: "Que te lo aprueben rápido", desc: "No significa que sea buena decisión.", correct: false, target: "left" }
    ],
    teach: "Antes de adquirir un crédito es importante revisar la tasa de interés, comisiones y el costo total. Esto te permite tomar decisiones financieras más informadas."
  },
  {
    topic: "Seguridad",
    q: "Recibes un mensaje que pide tus datos bancarios. ¿Qué haces?",
    choices: [
      { title: "No compartir datos y verificar", desc: "Es la forma más segura.", correct: true, target: "left" },
      { title: "Ingresar datos para ganar un premio", desc: "Podría ser un fraude.", correct: false, target: "right" },
      { title: "Reenviarlo a amigos", desc: "Podrías poner en riesgo a otros.", correct: false, target: "center" }
    ],
    teach: "Nunca compartas tus claves, contraseñas o códigos bancarios. Ante cualquier duda, verifica siempre la información a través de canales oficiales."
  },
  {
    topic: "Metas",
    q: "Para ahorrar de forma efectiva es recomendable:",
    choices: [
      { title: "Tener una meta y ahorrar cada mes", desc: "La constancia es clave.", correct: true, target: "center" },
      { title: "Ahorrar solo si sobra dinero", desc: "Muchas veces nunca sobra.", correct: false, target: "left" },
      { title: "Guardar dinero sin objetivo", desc: "Es difícil mantener la motivación.", correct: false, target: "right" }
    ],
    teach: "Establecer metas de ahorro claras y ahorrar de forma constante facilita cumplir objetivos financieros importantes."
  },
  {
    topic: "Tarjeta",
    q: "Si utilizas una tarjeta de crédito, lo ideal es:",
    choices: [
      { title: "Pagar el total de la deuda", desc: "Así evitas intereses.", correct: true, target: "left" },
      { title: "Pagar solo el mínimo", desc: "Esto genera más intereses.", correct: false, target: "right" },
      { title: "Ignorar el estado de cuenta", desc: "Podrías perder el control.", correct: false, target: "center" }
    ],
    teach: "Pagar el total del saldo de tu tarjeta de crédito evita el cobro de intereses y te permite mantener un mejor control de tus finanzas."
  },
  {
    topic: "Gastos",
    q: "¿Qué son los gastos hormiga?",
    choices: [
      { title: "Pequeños gastos que se repiten", desc: "Pueden sumar mucho dinero.", correct: true, target: "center" },
      { title: "Gastos grandes del hogar", desc: "No corresponde.", correct: false, target: "left" },
      { title: "Gastos solo de comida", desc: "Pueden ser de cualquier tipo.", correct: false, target: "right" }
    ],
    teach: "Los gastos hormiga son pequeños gastos frecuentes que parecen insignificantes, pero que al acumularse pueden afectar tu presupuesto."
  },
  {
    topic: "Comparación",
    q: "Antes de elegir un producto financiero debes:",
    choices: [
      { title: "Comparar opciones y condiciones", desc: "Te ayuda a elegir mejor.", correct: true, target: "right" },
      { title: "Elegir el primero que encuentres", desc: "Puede no ser la mejor opción.", correct: false, target: "center" },
      { title: "Elegir el más popular", desc: "No siempre es el más conveniente.", correct: false, target: "left" }
    ],
    teach: "Comparar tasas, comisiones y condiciones entre diferentes productos financieros te permite tomar mejores decisiones."
  },
  {
    topic: "Débito",
    q: "Una tarjeta de débito funciona:",
    choices: [
      { title: "Con el dinero de tu cuenta", desc: "No genera deuda.", correct: true, target: "left" },
      { title: "Como un préstamo", desc: "Eso corresponde a crédito.", correct: false, target: "right" },
      { title: "Generando intereses", desc: "No aplica en débito.", correct: false, target: "center" }
    ],
    teach: "La tarjeta de débito utiliza el dinero disponible en tu cuenta bancaria, por lo que no genera deuda ni intereses."
  },
  {
    topic: "Emergencias",
    q: "Un fondo de emergencia sirve para:",
    choices: [
      { title: "Cubrir gastos inesperados", desc: "Por ejemplo salud o reparaciones.", correct: true, target: "center" },
      { title: "Comprar cosas innecesarias", desc: "No es su objetivo.", correct: false, target: "left" },
      { title: "Viajar cada año", desc: "No corresponde a una emergencia.", correct: false, target: "right" }
    ],
    teach: "Un fondo de emergencia te permite enfrentar gastos inesperados sin necesidad de endeudarte."
  }
];

/* ===== HELPERS ===== */
const el = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeTap(handler, delay = KIOSK.lockMs) {
  return function wrapped(event) {
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

/* ===== ELEMENTS ===== */
const stadiumAudio = el("stadiumAudio");

const hudShot = el("hudShot");
const hudGoals = el("hudGoals");
const hudMiss = el("hudMiss");
const penaltyBar = $$(".penaltyDot");

const hudGoalsBox = hudGoals ? hudGoals.closest(".hudItem") : null;
const hudMissBox = hudMiss ? hudMiss.closest(".hudItem") : null;

const topicBadge = el("topicBadge");
const questionText = el("questionText");
const hintText = el("hintText");
const choicesWrap = el("choices");

const feedback = el("feedback");
const feedbackTitle = el("feedbackTitle");
const feedbackBody = el("feedbackBody");
const btnNext = el("btnNext");

const startOverlay = el("startOverlay");
const btnStart = el("btnStart");

const endOverlay = el("endOverlay");
const endCard = el("endCard");
const endIcon = el("endIcon");
const endTitle = el("endTitle");
const endScore = el("endScore");
const endLevel = el("endLevel");
const endMessage = el("endMessage");
const endTips = el("endTips");
const btnPlayAgain = el("btnPlayAgain");

const ball = el("ball");
const keeper = el("keeper");
const goal = el("goal");
const panel = el("panel");

const stadiumOverlay = el("stadiumOverlay");
const stadiumText = el("stadiumText");
const confettiCanvas = el("confettiCanvas");
const crowd = document.querySelector(".crowd");

const btnRestart = el("btnRestart");
const btnFullscreen = el("btnFullscreen");
const btnAudio = el("btnAudio");
const idleInfo = el("idleInfo");

/* ===== STATE ===== */
let gameQuestions = [];
let shotIndex = 0;
let goals = 0;
let miss = 0;
let locked = false;
let audioOn = true;
let audioCtx = null;
let audioEnabled = false;

/* ===== AUDIO ===== */
try {
  const saved = localStorage.getItem("penales_audio_on");
  if (saved !== null) {
    audioOn = saved === "true";
  }
} catch (error) {
  console.warn(error);
}

function updateAudioButton() {
  if (!btnAudio) return;
  btnAudio.textContent = `Sonido: ${audioOn ? "ON" : "OFF"}`;
}

function ensureAudio() {
  if (audioEnabled) return;

  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    audioEnabled = true;
  } catch (error) {
    audioEnabled = false;
  }
}

function setupBackgroundAudio() {
  if (!stadiumAudio) return;
  stadiumAudio.loop = true;
  stadiumAudio.volume = 0.35;
  stadiumAudio.preload = "auto";
}

async function playBackgroundAudio() {
  if (!stadiumAudio || !audioOn) return;
  try {
    stadiumAudio.loop = true;
    stadiumAudio.volume = 0.35;
    stadiumAudio.muted = false;
    await stadiumAudio.play();
  } catch (error) {
    console.warn("No se pudo reproducir el audio de fondo:", error);
  }
}

function pauseBackgroundAudio() {
  if (!stadiumAudio) return;
  stadiumAudio.pause();
}

function stopBackgroundAudio() {
  if (!stadiumAudio) return;
  stadiumAudio.pause();
  stadiumAudio.currentTime = 0;
}

function beep({
  freq = 440,
  dur = 0.12,
  type = "sine",
  gain = 0.06,
  attack = 0.01,
  release = 0.08
} = {}) {
  if (!audioOn || !audioEnabled || !audioCtx) return;

  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + dur + release);

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.start(t0);
  osc.stop(t0 + attack + dur + release + 0.02);
}

function noiseBurst({ dur = 0.15, gain = 0.05 } = {}) {
  if (!audioOn || !audioEnabled || !audioCtx) return;

  const bufferSize = Math.floor(audioCtx.sampleRate * dur);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    const k = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * k;
  }

  const src = audioCtx.createBufferSource();
  src.buffer = buffer;

  const g = audioCtx.createGain();
  g.gain.value = gain;

  src.connect(g);
  g.connect(audioCtx.destination);
  src.start();
}

const SFX = {
  click() {
    beep({ freq: 520, dur: 0.05, type: "triangle", gain: 0.05 });
  },
  goal() {
    beep({ freq: 523, dur: 0.08, type: "sawtooth", gain: 0.05 });
    setTimeout(() => beep({ freq: 659, dur: 0.1, type: "sawtooth", gain: 0.055 }), 80);
    setTimeout(() => beep({ freq: 784, dur: 0.12, type: "sawtooth", gain: 0.06 }), 170);
    setTimeout(() => noiseBurst({ dur: 0.22, gain: 0.06 }), 120);
  },
  save() {
    beep({ freq: 180, dur: 0.1, type: "square", gain: 0.05 });
    setTimeout(() => beep({ freq: 140, dur: 0.12, type: "square", gain: 0.045 }), 90);
    setTimeout(() => noiseBurst({ dur: 0.1, gain: 0.04 }), 60);
  },
  whistle() {
    beep({ freq: 1200, dur: 0.06, type: "sine", gain: 0.04 });
    setTimeout(() => beep({ freq: 1600, dur: 0.08, type: "sine", gain: 0.04 }), 70);
  }
};

/* ===== KIOSK SCALING ===== */
function setRealViewportHeight() {
  const realHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const vh = realHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

function fitGameToScreen() {
  const ww = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const wh = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const scaleX = ww / KIOSK.BASE_WIDTH;
  const scaleY = wh / KIOSK.BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty("--game-scale", String(scale));
}

function forceReflowResize() {
  setRealViewportHeight();
  fitGameToScreen();

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 100);

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 350);

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 700);

  resizeConfetti();
}

function handleResizeOptimized() {
  if (KIOSK.resizeRaf) {
    cancelAnimationFrame(KIOSK.resizeRaf);
  }

  KIOSK.resizeRaf = requestAnimationFrame(() => {
    forceReflowResize();
  });
}

function blockProblematicGestures() {
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

/* ===== FULLSCREEN ===== */
async function enterFullscreen() {
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

function updateFullscreenButtonText() {
  if (!btnFullscreen) return;
  btnFullscreen.textContent = document.fullscreenElement
    ? "Pantalla completa activa"
    : "Pantalla completa";
}

function tryFullscreenOnce() {
  if (KIOSK.fullscreenTried) return;
  KIOSK.fullscreenTried = true;
  enterFullscreen().finally(() => {
    updateFullscreenButtonText();
    forceReflowResize();
  });
}

/* ===== IDLE ===== */
function resetIdle() {
  KIOSK.idleLeft = IDLE_SECONDS;
  if (idleInfo) {
    idleInfo.textContent = `Inactividad: ${KIOSK.idleLeft}s`;
  }

  if (KIOSK.idleTimer) {
    clearInterval(KIOSK.idleTimer);
  }

  KIOSK.idleTimer = setInterval(() => {
    KIOSK.idleLeft -= 1;

    if (idleInfo) {
      idleInfo.textContent = `Inactividad: ${KIOSK.idleLeft}s`;
    }

    if (KIOSK.idleLeft <= 0) {
      clearInterval(KIOSK.idleTimer);
      restartGame(true);
    }
  }, 1000);
}

/* ===== HUD ===== */
function setHUD() {
  hudShot.textContent = `${Math.min(shotIndex + 1, TOTAL_SHOTS)} / ${TOTAL_SHOTS}`;
  hudGoals.textContent = String(goals);
  hudMiss.textContent = String(miss);
}

function resetPenaltyBar() {
  penaltyBar.forEach((dot) => {
    dot.classList.remove("dot-goal", "dot-miss", "dot-active");
  });

  if (penaltyBar[0]) {
    penaltyBar[0].classList.add("dot-active");
  }
}

function updatePenaltyBar(index, result) {
  if (!penaltyBar[index]) return;

  penaltyBar[index].classList.remove("dot-active");

  if (result === "goal") {
    penaltyBar[index].classList.add("dot-goal");
  }

  if (result === "miss") {
    penaltyBar[index].classList.add("dot-miss");
  }

  if (penaltyBar[index + 1]) {
    penaltyBar[index + 1].classList.add("dot-active");
  }
}

function popScore(box, type) {
  if (!box) return;

  box.classList.remove("score-pop", "goal-glow", "miss-glow");
  box.offsetHeight;
  box.classList.add("score-pop");

  if (type === "goal") {
    box.classList.add("goal-glow");
  }

  if (type === "miss") {
    box.classList.add("miss-glow");
  }
}

/* ===== SCREEN STATES ===== */
function showStart() {
  startOverlay.classList.remove("hidden");
  endOverlay.classList.add("hidden");
  feedback.classList.remove("show");
}

function hideStart() {
  startOverlay.classList.add("hidden");
}

function showEnd() {
  endOverlay.classList.remove("hidden");
  locked = true;

  const score = goals;
  endScore.textContent = `${score} / ${TOTAL_SHOTS}`;
  endCard.classList.remove("end-win", "end-mid", "end-try");

  let title = "¡Final!";
  let level = "A seguir practicando";
  let message = "Cada decisión cuenta. Sigue practicando para convertirte en campeón financiero.";
  let icon = "⚽";

  if (score === 5) {
    endCard.classList.add("end-win");
    title = "¡Campeón Financiero!";
    level = "Logro perfecto 🏆";
    message = "Anotaste los 5 penales y demostraste excelentes decisiones financieras. ¡Gran trabajo!";
    icon = "🏆";
  } else if (score === 4) {
    endCard.classList.add("end-mid");
    title = "¡Casi perfecto!";
    level = "Muy buen resultado ⭐";
    message = "Te quedaste a un paso del 5 de 5. Vas por excelente camino en tus decisiones financieras.";
    icon = "🌟";
  } else if (score === 3) {
    endCard.classList.add("end-mid");
    title = "¡Buen partido!";
    level = "Buen intento 👏";
    message = "Lograste un buen resultado. Sigue jugando para fortalecer aún más tus conocimientos financieros.";
    icon = "👏";
  } else {
    endCard.classList.add("end-try");
    title = "¡Sigue intentándolo!";
    level = "Cada intento suma 💪";
    message = "No pasa nada. Cada penal es una oportunidad para aprender y mejorar tus decisiones financieras.";
    icon = "💪";
  }

  endTitle.textContent = title;
  endLevel.textContent = level;
  endMessage.textContent = message;
  endIcon.textContent = icon;

  const tips = [
    "• Haz un presupuesto simple: ingresos – gastos.",
    "• Ahorra con meta y crea un fondo para imprevistos.",
    "• Antes de usar crédito, revisa el costo total.",
    "• No compartas datos bancarios; verifica por canales oficiales."
  ];

  endTips.innerHTML = tips.join("<br>");

  if (score === 5) {
    burstConfetti(220);
  } else if (score >= 4) {
    burstConfetti(140);
  }

  SFX.whistle();
}

/* ===== FIELD / ANIMATION ===== */
function resetFieldPositions() {
  ball.style.animation = "none";
  keeper.style.animation = "none";
  ball.style.transition = "none";
  keeper.style.transition = "none";

  ball.style.left = "50%";
  ball.style.top = "79%";
  ball.style.transform = "translate(-50%,-50%) scale(1)";

  keeper.style.left = "50%";
  keeper.style.top = "48%";
  keeper.style.transform = "translate(-50%,-50%) scale(1)";

  goal.classList.remove("goal-hit");

  ball.offsetHeight;
  keeper.offsetHeight;
}

function clearShotAnimations() {
  ball.style.animation = "none";
  keeper.style.animation = "none";
  ball.style.transition = "none";
  keeper.style.transition = "none";
  goal.classList.remove("goal-hit");
  ball.offsetHeight;
  keeper.offsetHeight;
}

function getDifferentKeeperTarget(ballTarget) {
  const options = ["left", "center", "right"].filter((side) => side !== ballTarget);
  return shuffle(options)[0];
}

function getShotAnimationName(target, isGoal) {
  if (isGoal) {
    if (target === "left") return "shot-left-goal";
    if (target === "right") return "shot-right-goal";
    return "shot-center-goal";
  }

  if (target === "left") return "shot-left-save";
  if (target === "right") return "shot-right-save";
  return "shot-center-save";
}

function getKeeperAnimationName(target, isGoal) {
  if (isGoal) {
    if (target === "left") return "keeper-fail-left";
    if (target === "right") return "keeper-fail-right";
    return "keeper-fail-center";
  }

  if (target === "left") return "keeper-save-left";
  if (target === "right") return "keeper-save-right";
  return "keeper-save-center";
}

function animateShot(ballTarget, keeperTarget, isGoal) {
  clearShotAnimations();

  const shotAnim = getShotAnimationName(ballTarget, isGoal);
  const keeperAnim = getKeeperAnimationName(keeperTarget, isGoal);

  const ballDuration = isGoal ? 760 : 720;
  const keeperDuration = isGoal ? 620 : 620;
  const keeperDelay = isGoal ? 110 : 0;

  ball.style.animation = `${shotAnim} ${ballDuration}ms cubic-bezier(.18,.88,.2,1) forwards`;
  keeper.style.animation = `${keeperAnim} ${keeperDuration}ms cubic-bezier(.2,.9,.25,1) ${keeperDelay}ms forwards`;

  panel.classList.remove("popGood", "popBad");
  panel.offsetHeight;
  panel.classList.add(isGoal ? "popGood" : "popBad");

  if (isGoal) {
    setTimeout(() => goal.classList.add("goal-hit"), 360);
  }

  setTimeout(() => {
    panel.classList.remove("popGood", "popBad");
  }, 900);
}

function showStadiumMessage(type) {
  if (!stadiumOverlay || !stadiumText) return;

  stadiumText.classList.remove("goal", "miss");
  stadiumText.classList.add(type);
  stadiumText.textContent = type === "goal" ? "GOOOL" : "¡ATAJADO!";

  stadiumOverlay.classList.add("show");
  setTimeout(() => {
    stadiumOverlay.classList.remove("show");
  }, 950);
}

function reactCrowd(type) {
  if (!crowd) return;

  crowd.classList.remove("goal-cheer", "save-react");
  crowd.offsetHeight;

  if (type === "goal") {
    crowd.classList.add("goal-cheer");
    setTimeout(() => crowd.classList.remove("goal-cheer"), 720);
  }

  if (type === "save") {
    crowd.classList.add("save-react");
    setTimeout(() => crowd.classList.remove("save-react"), 540);
  }
}

/* ===== CONFETTI ===== */
const confetti = {
  canvas: confettiCanvas,
  ctx: null,
  pieces: [],
  running: false,
  raf: null
};

function resizeConfetti() {
  if (!confetti.canvas) return;

  const shell = document.getElementById("game-shell");
  const width = shell ? shell.clientWidth : KIOSK.BASE_WIDTH;
  const height = shell ? shell.clientHeight : KIOSK.BASE_HEIGHT;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  confetti.canvas.width = Math.floor(width * dpr);
  confetti.canvas.height = Math.floor(height * dpr);
  confetti.canvas.style.width = `${width}px`;
  confetti.canvas.style.height = `${height}px`;

  confetti.ctx = confetti.canvas.getContext("2d");
  confetti.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function burstConfetti(amount = 80) {
  if (!confetti.canvas) return;
  if (!confetti.ctx) resizeConfetti();

  const width = 1920;
  const height = 1080;

  for (let i = 0; i < amount; i += 1) {
    confetti.pieces.push({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.2,
      vx: (Math.random() - 0.5) * 2.6,
      vy: 2.8 + Math.random() * 3.4,
      size: 6 + Math.random() * 10,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      life: 140 + Math.random() * 90,
      hue: Math.floor(Math.random() * 360)
    });
  }

  if (!confetti.running) {
    confetti.running = true;
    loopConfetti();
  }
}

function loopConfetti() {
  const ctx = confetti.ctx;
  if (!ctx) return;

  ctx.clearRect(0, 0, 1920, 1080);

  for (let i = confetti.pieces.length - 1; i >= 0; i -= 1) {
    const p = confetti.pieces[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 170));
    ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
    ctx.restore();

    if (p.y > 1140 || p.life <= 0) {
      confetti.pieces.splice(i, 1);
    }
  }

  if (confetti.pieces.length === 0) {
    confetti.running = false;
    cancelAnimationFrame(confetti.raf);
    return;
  }

  confetti.raf = requestAnimationFrame(loopConfetti);
}

/* ===== GAME FLOW ===== */
function buildQuestionSet() {
  return shuffle(QUESTIONS).slice(0, TOTAL_SHOTS);
}

function renderQuestion() {
  locked = false;
  feedback.classList.remove("show");

  const item = gameQuestions[shotIndex];
  if (!item) return;

  resetFieldPositions();

  topicBadge.textContent = item.topic;
  questionText.textContent = item.q;
  hintText.textContent = "Elige la mejor opción para “anotar”.";

  choicesWrap.innerHTML = "";
  const randomized = shuffle(item.choices);

  randomized.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.innerHTML = `${choice.title}<small>${choice.desc}</small>`;

    btn.addEventListener(
      "click",
      safeTap(() => {
        handleAnswer(choice);
      }, 500),
      { passive: false }
    );

    choicesWrap.appendChild(btn);
  });

  setHUD();
}

function handleAnswer(choice) {
  if (locked) return;
  locked = true;

  SFX.click();

  const isGoal = choice.correct;
  const ballTarget = choice.target;
  const keeperTarget = isGoal ? getDifferentKeeperTarget(ballTarget) : ballTarget;

  animateShot(ballTarget, keeperTarget, isGoal);

  setTimeout(() => {
    if (isGoal) {
      goals += 1;
      updatePenaltyBar(shotIndex, "goal");
      popScore(hudGoalsBox, "goal");
      showStadiumMessage("goal");
      reactCrowd("goal");
      SFX.goal();
    } else {
      miss += 1;
      updatePenaltyBar(shotIndex, "miss");
      popScore(hudMissBox, "miss");
      showStadiumMessage("miss");
      reactCrowd("save");
      SFX.save();
    }

    setHUD();
    showFeedback(isGoal, choice);
  }, 760);
}

function showFeedback(isGoal, choice) {
  const item = gameQuestions[shotIndex];
  feedbackTitle.textContent = isGoal ? "¡Gol!" : "Esta vez no entró";
  feedbackBody.textContent = `${choice.desc} ${item.teach}`;
  feedback.classList.add("show");
}

function nextQuestion() {
  feedback.classList.remove("show");
  shotIndex += 1;

  if (shotIndex >= TOTAL_SHOTS) {
    showEnd();
    return;
  }

  renderQuestion();
}

function startGame() {
  ensureAudio();
  playBackgroundAudio();
  hideStart();

  shotIndex = 0;
  goals = 0;
  miss = 0;
  locked = false;

  gameQuestions = buildQuestionSet();
  resetPenaltyBar();
  setHUD();
  renderQuestion();
  resetIdle();
  forceReflowResize();
}

function restartGame(fromIdle = false) {
  stopBackgroundAudio();
  gameQuestions = buildQuestionSet();
  shotIndex = 0;
  goals = 0;
  miss = 0;
  locked = false;

  endOverlay.classList.add("hidden");
  feedback.classList.remove("show");
  resetPenaltyBar();
  setHUD();
  resetFieldPositions();
  showStart();
  resetIdle();
  forceReflowResize();

  if (fromIdle) {
    endOverlay.classList.add("hidden");
  }
}

/* ===== EVENTS ===== */
function setupButtons() {
  btnStart.addEventListener(
    "click",
    safeTap(() => {
      startGame();
    }),
    { passive: false }
  );

  btnNext.addEventListener(
    "click",
    safeTap(() => {
      nextQuestion();
    }),
    { passive: false }
  );

  btnPlayAgain.addEventListener(
    "click",
    safeTap(() => {
      restartGame(false);
    }),
    { passive: false }
  );

  btnRestart.addEventListener(
    "click",
    safeTap(() => {
      restartGame(false);
    }),
    { passive: false }
  );

  btnFullscreen.addEventListener(
    "click",
    safeTap(async () => {
      await enterFullscreen();
      updateFullscreenButtonText();
      resetIdle();
      forceReflowResize();
    }),
    { passive: false }
  );

  btnAudio.addEventListener(
    "click",
    safeTap(() => {
      audioOn = !audioOn;

      try {
        localStorage.setItem("penales_audio_on", String(audioOn));
      } catch (error) {
        console.warn(error);
      }

      if (audioOn) {
        ensureAudio();
        playBackgroundAudio();
      } else {
        pauseBackgroundAudio();
      }

      updateAudioButton();
      resetIdle();
    }),
    { passive: false }
  );
}

function setupActivityListeners() {
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

function preloadAssets() {
  ["assets/edusib.png", "assets/moneyweek.png", "assets/guantes.png", "assets/balon.png"].forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  });
}

/* ===== EXTRA CSS ANIMS INJECT ===== */
function injectDynamicAnimations() {
  if (document.getElementById("penales-anim-fix")) return;

  const style = document.createElement("style");
  style.id = "penales-anim-fix";
  style.textContent = `
    @keyframes shot-left-goal {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 46%;
        top: 68%;
        transform: translate(-50%, -50%) scale(.94) rotate(-75deg);
      }
      55% {
        left: 38%;
        top: 53%;
        transform: translate(-50%, -50%) scale(.78) rotate(-170deg);
      }
      100% {
        left: 29%;
        top: 31%;
        transform: translate(-50%, -50%) scale(.50) rotate(-290deg);
      }
    }

    @keyframes shot-center-goal {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 50%;
        top: 67%;
        transform: translate(-50%, -50%) scale(.94) rotate(-75deg);
      }
      55% {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(.78) rotate(-170deg);
      }
      100% {
        left: 50%;
        top: 27%;
        transform: translate(-50%, -50%) scale(.48) rotate(-290deg);
      }
    }

    @keyframes shot-right-goal {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 54%;
        top: 68%;
        transform: translate(-50%, -50%) scale(.94) rotate(75deg);
      }
      55% {
        left: 62%;
        top: 53%;
        transform: translate(-50%, -50%) scale(.78) rotate(170deg);
      }
      100% {
        left: 71%;
        top: 31%;
        transform: translate(-50%, -50%) scale(.50) rotate(290deg);
      }
    }

    @keyframes shot-left-save {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 46%;
        top: 68%;
        transform: translate(-50%, -50%) scale(.95) rotate(-70deg);
      }
      55% {
        left: 40%;
        top: 57%;
        transform: translate(-50%, -50%) scale(.84) rotate(-155deg);
      }
      100% {
        left: 35.7%;
        top: 44.7%;
        transform: translate(-50%, -50%) scale(.68) rotate(-220deg);
      }
    }

    @keyframes shot-center-save {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 50%;
        top: 68%;
        transform: translate(-50%, -50%) scale(.95) rotate(-70deg);
      }
      55% {
        left: 50%;
        top: 57%;
        transform: translate(-50%, -50%) scale(.84) rotate(-155deg);
      }
      100% {
        left: 50%;
        top: 43.6%;
        transform: translate(-50%, -50%) scale(.68) rotate(-220deg);
      }
    }

    @keyframes shot-right-save {
      0% {
        left: 50%;
        top: 79%;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        left: 54%;
        top: 68%;
        transform: translate(-50%, -50%) scale(.95) rotate(70deg);
      }
      55% {
        left: 60%;
        top: 57%;
        transform: translate(-50%, -50%) scale(.84) rotate(155deg);
      }
      100% {
        left: 64.3%;
        top: 44.7%;
        transform: translate(-50%, -50%) scale(.68) rotate(220deg);
      }
    }

    @keyframes keeper-save-left {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 35.8%;
        top: 44.4%;
        transform: translate(-50%, -50%) rotate(-16deg) scale(1.16);
      }
    }

    @keyframes keeper-save-center {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 50%;
        top: 43.1%;
        transform: translate(-50%, -50%) scale(1.2);
      }
    }

    @keyframes keeper-save-right {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 64.2%;
        top: 44.4%;
        transform: translate(-50%, -50%) rotate(16deg) scale(1.16);
      }
    }

    @keyframes keeper-fail-left {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 64%;
        top: 40%;
        transform: translate(-50%, -50%) rotate(12deg) scale(1.05);
      }
    }

    @keyframes keeper-fail-center {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 34%;
        top: 42%;
        transform: translate(-50%, -50%) rotate(-12deg) scale(1.04);
      }
    }

    @keyframes keeper-fail-right {
      0% {
        left: 50%;
        top: 48%;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        left: 36%;
        top: 40%;
        transform: translate(-50%, -50%) rotate(-12deg) scale(1.05);
      }
    }
  `;
  document.head.appendChild(style);
}

/* ===== INIT ===== */
function init() {
  injectDynamicAnimations();
  blockProblematicGestures();
  preloadAssets();
  setupBackgroundAudio();
  setupButtons();
  setupActivityListeners();
  updateAudioButton();
  updateFullscreenButtonText();
  resetPenaltyBar();
  setHUD();
  resetFieldPositions();
  showStart();
  resetIdle();
  forceReflowResize();

  document.addEventListener(
    "pointerdown",
    () => {
      tryFullscreenOnce();
      ensureAudio();
    },
    { once: true, passive: true }
  );

  window.addEventListener("resize", handleResizeOptimized, { passive: true });
  window.addEventListener("orientationchange", handleResizeOptimized, { passive: true });

  document.addEventListener("fullscreenchange", () => {
    updateFullscreenButtonText();
    forceReflowResize();
  });

  document.addEventListener("webkitfullscreenchange", () => {
    updateFullscreenButtonText();
    forceReflowResize();
  });

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