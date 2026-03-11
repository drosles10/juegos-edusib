// ===== Config ===== 
const ROUND_SIZE = 10;

// Lista de tarjetas (puedes agregar más)
const items = [
  { emoji:"🍦", name:"Helado", answer:"want" },
  { emoji:"🎮", name:"Videojuego", answer:"want" },
  { emoji:"🧸", name:"Juguete", answer:"want" },
  { emoji:"🍿", name:"Palomitas del cine", answer:"want" },
  { emoji:"🎁", name:"Regalo extra", answer:"want" },
  { emoji:"🍕", name:"Pizza", answer:"want" },
  { emoji:"🎢", name:"Parque de diversiones", answer:"want" },
  { emoji:"📺", name:"Televisión nueva", answer:"want" },
  { emoji:"🎧", name:"Audífonos", answer:"want" },

  // Necesidades
  { emoji:"💧", name:"Agua", answer:"need" },
  { emoji:"🍎", name:"Comida", answer:"need" },
  { emoji:"🧥", name:"Ropa", answer:"need" },
  { emoji:"🏠", name:"Vivienda", answer:"need" },
  { emoji:"📚", name:"Útiles escolares", answer:"need" },
  { emoji:"🚍", name:"Transporte", answer:"need" },
  { emoji:"🩺", name:"Medicina", answer:"need" },
  { emoji:"🧼", name:"Jabón", answer:"need" },
  { emoji:"👟", name:"Zapatos", answer:"need" },
  { emoji:"💡", name:"Electricidad", answer:"need" },
  { emoji:"🪥", name:"Cepillo de dientes", answer:"need" },
];

// Mensajes tipo feria
const WOW_MSGS = ["¡Súper! 🌟", "¡Genial! 🎈", "¡Excelente! 🏆", "¡Muy bien! ✨", "¡Lo lograste! 🎉"];

// ===== DOM =====
const card = document.getElementById("card");
const need = document.getElementById("need");
const want = document.getElementById("want");
const msg = document.getElementById("msg");
const scorePill = document.getElementById("scorePill");
const resetBtn = document.getElementById("resetBtn");
const emojiEl = document.getElementById("emoji");
const titleEl = document.getElementById("title");

const confettiCanvas = document.getElementById("confetti");
const winScreen = document.getElementById("winScreen");
const winScore = document.getElementById("winScore");
const playAgainBtn = document.getElementById("playAgainBtn");

// Para cambiar textos del overlay (victoria / game over / inicio)
const winTitle = document.querySelector(".win-title");
const winSubtitle = document.querySelector(".win-subtitle");
const winEmoji = document.querySelector(".win-emoji");

// Progreso
const roundText = document.getElementById("roundText");
const progressFill = document.getElementById("progressFill");

// ===== Estado de juego =====
let deck = [];
let roundIndex = 0;      // 0..ROUND_SIZE-1
let score = 0;

let lives = 3;
const MAX_LIVES = 3;
const livesEl = document.getElementById("lives");

let locked = false;

// Modo del overlay: start | win | lose | playing
let overlayMode = "start";

// ===== Estado drag =====
let dragging = false;
let startX = 0, startY = 0;
let curX = 0, curY = 0;

// ===== Util: barajar =====
function shuffle(arr){
  const a = [...arr];
  for (let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== Audio (campanitas sin archivos) =====
let audioCtx = null;

function ensureAudio(){
  if (!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function tone({freq=440, duration=0.10, type="sine", gain=0.05, when=0}){
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
  tone({freq: 740, duration: 0.08, type:"sine", gain:0.06, when:0.00});
  tone({freq: 988, duration: 0.10, type:"sine", gain:0.06, when:0.09});
  tone({freq: 1175, duration: 0.12, type:"sine", gain:0.05, when:0.19});
}

function soundWrong(){
  tone({freq: 240, duration: 0.12, type:"triangle", gain:0.05, when:0.00});
  tone({freq: 180, duration: 0.20, type:"triangle", gain:0.05, when:0.10});
}

function soundWin(){
  const notes = [784, 880, 988, 1175, 1319];
  notes.forEach((f, i) => tone({freq:f, duration:0.10, type:"sine", gain:0.06, when:i*0.10}));
  setTimeout(()=> tone({freq:1568, duration:0.14, type:"sine", gain:0.06, when:0.00}), 520);
}

document.addEventListener("pointerdown", ensureAudio, {once:true});

// ===== UI helpers =====
function clearZoneStates(){
  [need, want].forEach(z => z.classList.remove("active","good","bad"));
}

function resetCardPosition(){
  curX = 0; curY = 0;
  card.style.setProperty("--x", "0px");
  card.style.setProperty("--y", "0px");
  card.style.setProperty("--rot", "0deg");
}

function updateScore(){
  scorePill.textContent = `Puntos: ${score}`;
}

function updateProgress(){
  if (roundText) roundText.textContent = `Tarjeta ${roundIndex + 1}/${ROUND_SIZE}`;
  if (progressFill){
    const pct = ((roundIndex + 1) / ROUND_SIZE) * 100;
    progressFill.style.width = `${pct}%`;

    // Flash del progreso
    progressFill.classList.add("flash");
    setTimeout(()=>progressFill.classList.remove("flash"), 300);
  }
}

function setCard(it){
  emojiEl.textContent = it.emoji;
  titleEl.textContent = it.name;

  updateProgress();
  msg.textContent = "";
  msg.className = "msg";

  clearZoneStates();
  resetCardPosition();
}

function renderLives(){
  if (!livesEl) return;
  const hearts = livesEl.querySelectorAll(".heart");
  hearts.forEach((h, i) => {
    if (i < lives){
      h.classList.add("on");
      h.classList.remove("off");
    } else {
      h.classList.add("off");
      h.classList.remove("on");
    }
  });
}

function zoneFromPoint(x, y){
  const zones = [need, want];
  for (const z of zones){
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
  setTimeout(()=> card.style.transition = "", 180);
}

// ===== Pantallas: Inicio / Victoria / Game Over =====
function setOverlayVictory(){
  if (winEmoji) winEmoji.textContent = "🎉";
  if (winTitle) winTitle.textContent = "¡Felicidades!";

  // 👇 IMPORTANTE: usamos HTML para el formato bonito (steps/badges)
  if (winSubtitle) {
    winSubtitle.innerHTML = `
      <div class="start-box win-box">
        <div class="start-line">
          <span class="badge">🏆 ¡Misión completada!</span>
        </div>

        <div class="start-steps">
          <div class="step">
            <span class="step-ico">⭐</span>
            <div><b>Tu puntaje:</b> <span class="chip chip-goal">${score}/${ROUND_SIZE}</span></div>
          </div>

          <div class="step">
            <span class="step-ico">💡</span>
            <div>
              <b>Recuerda:</b> una <span class="chip chip-need">Necesidad</span> es esencial,
              y un <span class="chip chip-want">Deseo</span> es algo que quieres, pero no es esencial.
            </div>
          </div>

          <div class="step">
            <span class="step-ico">🚀</span>
            <div><b>Reto:</b> Sigue practicando para fortalecer tu criterio y tomar mejores decisiones.</div>
          </div>
        </div>

        <div class="start-tip">¡Excelente trabajo! 🎈</div>
      </div>
    `;
  }

  if (playAgainBtn) playAgainBtn.textContent = "Jugar de nuevo 🚀";}

function showGameOver(){
  locked = true;
  overlayMode = "lose";

  if (winEmoji) winEmoji.textContent = "💔";
  if (winTitle) winTitle.textContent = "¡Ups!";
  if (winSubtitle) winSubtitle.textContent = "Se acabaron las vidas. Inténtalo de nuevo.";
winSubtitle.innerHTML = `
  Se acabaron las vidas. Inténtalo de nuevo.

  <div class="start-box" style="margin-top:14px">
    <div class="start-steps">
      <div class="step">
        <span class="step-ico">🟩</span>
        <strong>Necesidad:</strong> algo esencial para vivir o estar bien.
      </div>
      <div class="step">
        <span class="step-ico">🟥</span>
        <strong>Deseo:</strong> algo que quieres, pero no es esencial.
      </div>
    </div>
  </div>
`;
  if (winScore) {
    winScore.textContent = `Puntos: ${score}/${ROUND_SIZE}`;
    winScore.style.display = ""; // mostrar puntos
  }
  if (playAgainBtn) playAgainBtn.textContent = "Intentar de nuevo";

  winScreen.classList.add("show","start");
  winScreen.setAttribute("aria-hidden","false");
}

function showStartScreen(){
  locked = true;
  overlayMode = "start";

  if (winEmoji) winEmoji.textContent = "💡";
if (winTitle) winTitle.textContent = "¿Lo Necesito o lo Deseo?";
if (winSubtitle) winSubtitle.innerHTML = `
   <div class="start-box">
    <div class="start-line">
      <span class="badge">🏦 Superintendencia de Bancos</span>
    </div>

    <div class="start-steps">
      <div class="step"><span class="step-ico">1️⃣</span> Arrastra la tarjeta a <span class="chip chip-need">Necesidad</span> o <span class="chip chip-want">Deseo</span>.</div>
      <div class="step"><span class="step-ico">2️⃣</span> Tienes <span class="chip chip-life">3 vidas ❤️</span> para intentarlo.</div>
      <div class="step"><span class="step-ico">3️⃣</span> Completa <span class="chip chip-goal">10 tarjetas</span> y gana un premio 🎁.</div>
    </div>

    <div class="start-tip">Tip: piensa si es <strong>algo esencial</strong> o <strong>algo que deseas</strong>.</div>
  </div>
`;

  // 👉 MOSTRAR OVERLAY COMO PANTALLA DE INICIO
  winScreen.classList.add("show", "start");
  winScreen.setAttribute("aria-hidden","false");



  // En inicio no mostramos puntos
  if (winScore) winScore.style.display = "none";

  if (playAgainBtn) playAgainBtn.textContent = "Iniciar";

  winScreen.classList.add("show");
  winScreen.setAttribute("aria-hidden","false");
}

// ===== Ronda (10 tarjetas) =====
function startRound(){
  overlayMode = "playing";

  // Oculta overlay si estaba abierto
  winScreen.classList.remove("show","start");
  winScreen.setAttribute("aria-hidden","true");

  // Asegura que score vuelva a mostrarse en win/lose
  if (winScore) winScore.style.display = "";

  locked = false;

  score = 0;
  roundIndex = 0;

  lives = MAX_LIVES;
  renderLives();

  deck = shuffle(items).slice(0, Math.min(ROUND_SIZE, items.length));
  updateScore();
  setCard(deck[roundIndex]);
}

function endRound(){
  locked = true;

  // Asegura textos de victoria
  setOverlayVictory();

  if (winScore) winScore.textContent = `Puntos: ${score}/${ROUND_SIZE}`;
  winScreen.classList.add("show");
  winScreen.setAttribute("aria-hidden","false");

  soundWin();

  // CONFETI WOW automático en final
  launchConfetti({count: 320, ms: 2400, spread: 12});

  // ===== Celebración del fondo =====
  const bg = document.querySelector(".bg-fair");
  if(bg){
    bg.classList.add("celebrate");
    setTimeout(()=> bg.classList.remove("celebrate"), 2000);
  }
}

// ===== Confeti (canvas) =====
const confetti = { parts: [], tEnd: 0 };

function resizeConfetti(){
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  confettiCanvas.width = Math.floor(confettiCanvas.clientWidth * dpr);
  confettiCanvas.height = Math.floor(confettiCanvas.clientHeight * dpr);
  const ctx = confettiCanvas.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", resizeConfetti, {passive:true});

function launchConfetti(opts = {}){
  resizeConfetti();
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;

  const count = opts.count ?? 140;
  const ms = opts.ms ?? 900;
  const spread = opts.spread ?? 7;

  for (let i=0; i<count; i++){
    confetti.parts.push({
      x: w * 0.5,
      y: h * 0.22,
      vx: (Math.random()*2 - 1) * spread,
      vy: (Math.random()*-1) * (spread + 2) - (spread * 0.6),
      g: 0.22 + Math.random()*0.18,
      s: 6 + Math.random()*10,
      r: Math.random() * Math.PI,
      vr: (Math.random()*2 - 1) * 0.22,
      life: 90 + Math.random()*70,
      hue: Math.floor(Math.random()*360),
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

  ctx.clearRect(0,0,w,h);

  confetti.parts = confetti.parts.filter(p => p.life > 0);
  for (const p of confetti.parts){
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
    ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.65);
    ctx.restore();
  }

  if (now < confetti.tEnd || confetti.parts.length > 0){
    requestAnimationFrame(confettiStep);
  } else {
    ctx.clearRect(0,0,w,h);
  }
}

// ===== Evaluación =====
function currentCard(){
  return deck[roundIndex];
}

function goNext(){
  roundIndex++;
  if (roundIndex >= ROUND_SIZE){
    endRound();
    return;
  }
  setTimeout(()=> setCard(deck[roundIndex]), 420);
}

function wowMessage(){
  const t = WOW_MSGS[Math.floor(Math.random()*WOW_MSGS.length)];
  msg.textContent = t;
  msg.className = "msg good pop";
}

function checkDrop(choice){
  if (locked) return;

  const correct = currentCard().answer;
  const ok = (choice === correct);

  clearZoneStates();
  const z = choice === "need" ? need : want;
  z.classList.add(ok ? "good" : "bad");

  if (ok){
    score += 1;
    updateScore();

    wowMessage();
    soundCorrect();

    // confeti pequeño solo cuando acierta
    launchConfetti({count: 120, ms: 850, spread: 7});

    locked = true;
    setTimeout(()=>{
      locked = false;
      goNext();
    }, 520);

  } else {
    msg.textContent = "Casi… inténtalo de nuevo ❌";
    msg.className = "msg bad pop";
    soundWrong();

    lives -= 1;
    renderLives();

    if (lives <= 0){
      msg.textContent = "¡Se acabaron las vidas! 💔";
      msg.className = "msg bad";
      showGameOver();
      return;
    }

    snapBack();
  }
}

// ===== Drag con Pointer Events =====
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

  if (!z){
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

// ===== Botones =====
resetBtn.addEventListener("click", startRound);

// Botón del overlay: Iniciar / Intentar de nuevo / Jugar otra vez
playAgainBtn.addEventListener("click", () => {
  // En todos los casos inicia una nueva ronda
  startRound();
});

// ===== Inicio =====
// En vez de arrancar directo, mostramos la pantalla inicial:
showStartScreen();

// ===== Música de fondo =====
const bgMusic = document.getElementById("bgMusic");

function startMusic(){
  if (!bgMusic) return;
  bgMusic.volume = 0.18;
  bgMusic.play().catch(()=>{});
}

document.addEventListener("pointerdown", startMusic, { once: true });

const muteBtn = document.getElementById("muteBtn");
if (muteBtn){
  muteBtn.addEventListener("click", ()=>{
    if (!bgMusic) return;
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇 Música" : "🔊 Música";
  });
}