/* Penales del Ahorro - juego táctil offline */


const TOTAL_SHOTS = 5;
const IDLE_SECONDS = 30;

const stadiumAudio = document.getElementById("stadiumAudio");

// ===== Audio toggle (ON/OFF) =====
let audioOn = true;
try {
  const saved = localStorage.getItem("penales_audio_on");
  if (saved !== null) audioOn = saved === "true";
} catch (e) {
  // ignore
}

// ===== Sonidos (WebAudio - offline, sin archivos) =====
let audioCtx = null;
let audioEnabled = false;

function ensureAudio() {
  if (audioEnabled) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    audioEnabled = true;
  } catch (e) {
    audioEnabled = false;
  }
}

function beep({ freq = 440, dur = 0.12, type = "sine", gain = 0.06, attack = 0.01, release = 0.08 } = {}) {
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

  for (let i = 0; i < bufferSize; i++) {
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
    setTimeout(() => beep({ freq: 659, dur: 0.10, type: "sawtooth", gain: 0.055 }), 80);
    setTimeout(() => beep({ freq: 784, dur: 0.12, type: "sawtooth", gain: 0.06 }), 170);
    setTimeout(() => noiseBurst({ dur: 0.22, gain: 0.06 }), 120);
  },
  save() {
    beep({ freq: 180, dur: 0.10, type: "square", gain: 0.05 });
    setTimeout(() => beep({ freq: 140, dur: 0.12, type: "square", gain: 0.045 }), 90);
    setTimeout(() => noiseBurst({ dur: 0.10, gain: 0.04 }), 60);
  },
  whistle() {
    beep({ freq: 1200, dur: 0.06, type: "sine", gain: 0.04 });
    setTimeout(() => beep({ freq: 1600, dur: 0.08, type: "sine", gain: 0.04 }), 70);
  }
};

// ===== Banco de 10 preguntas =====
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

let gameQuestions = [];

const el = (id) => document.getElementById(id);

const hudShot = el("hudShot");
const hudGoals = el("hudGoals");
const hudMiss = el("hudMiss");

const penaltyBar = document.querySelectorAll(".penaltyDot");

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

const stadiumOverlay = el("stadiumOverlay");
const stadiumText = el("stadiumText");
const confettiCanvas = document.getElementById("confettiCanvas");
const crowd = document.querySelector(".crowd");

const btnRestart = el("btnRestart");
const btnFullscreen = el("btnFullscreen");
const btnAudio = el("btnAudio");
const idleInfo = el("idleInfo");

let shotIndex = 0;
let goals = 0;
let miss = 0;
let locked = false;
let idleTimer = null;
let idleLeft = IDLE_SECONDS;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function resetIdle() {
  idleLeft = IDLE_SECONDS;
  if (idleInfo) idleInfo.textContent = `Inactividad: ${idleLeft}s`;

  if (idleTimer) clearInterval(idleTimer);

  idleTimer = setInterval(() => {
    idleLeft -= 1;
    if (idleInfo) idleInfo.textContent = `Inactividad: ${idleLeft}s`;

    if (idleLeft <= 0) {
      clearInterval(idleTimer);
      restartGame(true);
    }
  }, 1000);
}

function setHUD() {
  hudShot.textContent = `${Math.min(shotIndex + 1, TOTAL_SHOTS)}/${TOTAL_SHOTS}`;
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

  const next = penaltyBar[index + 1];
  if (next) {
    next.classList.add("dot-active");
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

function resetFieldPositions() {
  ball.style.animation = "none";
  keeper.style.animation = "none";

  ball.style.left = "50%";
  ball.style.top = "78%";
  ball.style.transform = "translate(-50%,-50%)";

  keeper.style.left = "50%";
  keeper.style.top = "48%";
  keeper.style.transform = "translate(-50%,-50%)";

  ball.offsetHeight;
  keeper.offsetHeight;
}

function clearShotAnimations() {
  ball.style.animation = "none";
  keeper.style.animation = "none";
  ball.offsetHeight;
  keeper.offsetHeight;
}

function animateShot(target, keeperTarget, isGoal) {
  clearShotAnimations();

  const shotAnim = target === "left" ? "shot-left" : target === "right" ? "shot-right" : "shot-center";
  const keeperAnim = keeperTarget === "left" ? "keeper-left" : keeperTarget === "right" ? "keeper-right" : "keeper-center";

  ball.style.animation = `${shotAnim} 820ms cubic-bezier(.18,.88,.2,1) forwards`;
  keeper.style.animation = `${keeperAnim} 520ms cubic-bezier(.2,.9,.25,1) forwards`;

  const panel = el("panel");
  panel.classList.remove("popGood", "popBad");
  panel.classList.add(isGoal ? "popGood" : "popBad");
  setTimeout(() => panel.classList.remove("popGood", "popBad"), 900);
}

function showStadiumMessage(type) {
  if (!stadiumOverlay || !stadiumText) return;

  stadiumText.classList.remove("goal", "miss");
  stadiumText.classList.add(type);
  stadiumText.textContent = type === "goal" ? "GOOOL" : "¡ATAJADO!";

  stadiumOverlay.classList.add("show");
  setTimeout(() => stadiumOverlay.classList.remove("show"), 950);
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

// Confetti simple
const confetti = {
  canvas: confettiCanvas,
  ctx: null,
  pieces: [],
  running: false,
  raf: null
};

function resizeConfetti() {
  if (!confetti.canvas) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  confetti.canvas.width = Math.floor(window.innerWidth * dpr);
  confetti.canvas.height = Math.floor(window.innerHeight * dpr);
  confetti.canvas.style.width = `${window.innerWidth}px`;
  confetti.canvas.style.height = `${window.innerHeight}px`;

  confetti.ctx = confetti.canvas.getContext("2d");
  confetti.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function burstConfetti(amount = 80) {
  if (!confetti.canvas) return;
  if (!confetti.ctx) resizeConfetti();

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < amount; i++) {
    confetti.pieces.push({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.2,
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

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = confetti.pieces.length - 1; i >= 0; i--) {
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

    if (p.y > window.innerHeight + 60 || p.life <= 0) {
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

  randomized.forEach((c, idx) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.innerHTML = `${idx + 1}. ${c.title}<small>${c.desc}</small>`;
    btn.addEventListener("pointerdown", () => handleChoice(c, item));
    choicesWrap.appendChild(btn);
  });

  setHUD();
}

function handleChoice(choice, item) {
  if (locked) return;
  locked = true;
  resetIdle();

  SFX.click();

  const correctChoice = item.choices.find((c) => c.correct);
  const isGoal = !!choice.correct;

  const keeperTarget = isGoal
    ? (choice.target === "left" ? "right" : choice.target === "right" ? "left" : "left")
    : choice.target;

  animateShot(choice.target, keeperTarget, isGoal);

  const goalEl = document.querySelector(".goal");

  if (isGoal) {
    if (goalEl) {
      goalEl.classList.add("goal-hit");
      setTimeout(() => goalEl.classList.remove("goal-hit"), 450);
    }
    reactCrowd("goal");
  } else {
    keeper.classList.add("save-hit");
    setTimeout(() => keeper.classList.remove("save-hit"), 220);
    reactCrowd("save");
  }

  showStadiumMessage(isGoal ? "goal" : "miss");

  if (isGoal) {
    SFX.goal();
    burstConfetti(70);
    goals++;
    setHUD();
    updatePenaltyBar(shotIndex, "goal");
    popScore(hudGoalsBox, "goal");
  } else {
    SFX.save();
    miss++;
    setHUD();
    updatePenaltyBar(shotIndex, "miss");
    popScore(hudMissBox, "miss");
  }

  setTimeout(() => {
    feedback.classList.add("show");
    feedbackTitle.textContent = isGoal ? "¡GOOOL! ✅" : "¡Atajado! ❌";
    const correctText = `La opción correcta era: “${correctChoice.title}”.`;
    feedbackBody.textContent = `${correctText} ${item.teach}`;
    btnNext.textContent = shotIndex < TOTAL_SHOTS - 1 ? "Siguiente penal" : "Ver resultado";
  }, 900);
}

function next() {
  resetIdle();
  resetFieldPositions();

  if (shotIndex < TOTAL_SHOTS - 1) {
    shotIndex += 1;
    renderQuestion();
  } else {
    feedback.classList.remove("show");
    showEnd();
  }
}

function restartGame(fromIdle = false) {
  gameQuestions = shuffle(QUESTIONS).slice(0, TOTAL_SHOTS);

  shotIndex = 0;
  goals = 0;
  miss = 0;
  locked = false;

  resetPenaltyBar();
  resetFieldPositions();
  setHUD();

  endOverlay.classList.add("hidden");

  if (fromIdle) {
    showStart();
  } else {
    hideStart();
  }

  renderQuestion();
  resetIdle();
}

async function goFullscreen() {
  try {
    const root = el("app");
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await root.requestFullscreen();
    }
  } catch (e) {
    // ignore
  }
}

function wireGlobalActivity() {
  const events = ["pointerdown", "pointermove", "keydown", "touchstart"];
  events.forEach((evt) => window.addEventListener(evt, resetIdle, { passive: true }));
}

function updateAudioButton() {
  if (!btnAudio) return;
  btnAudio.textContent = audioOn ? "Sonido: ON" : "Sonido: OFF";
}

function toggleAudio() {
  audioOn = !audioOn;
  try {
    localStorage.setItem("penales_audio_on", String(audioOn));
  } catch (e) {
    // ignore
  }
  updateAudioButton();

  if (audioOn) {
    ensureAudio();
    SFX.click();
  }
}

function init() {
  showStart();
  wireGlobalActivity();
  resizeConfetti();
  window.addEventListener("resize", resizeConfetti);
  updateAudioButton();
  resetPenaltyBar();
  resetFieldPositions();
  setHUD();

  btnStart.addEventListener("click", () => {
    if (audioOn) ensureAudio();
    if (audioOn) SFX.whistle();
    restartGame(false);
  });

  btnNext.addEventListener("click", next);
  btnPlayAgain.addEventListener("click", () => restartGame(false));
  btnRestart.addEventListener("click", () => restartGame(false));
  btnFullscreen.addEventListener("click", goFullscreen);

  if (btnAudio) btnAudio.addEventListener("click", toggleAudio);
}

init();