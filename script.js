const fullscreenBtn = document.getElementById("fullscreenBtn");
const attractHint = document.getElementById("attractHint");
const gameCards = Array.from(document.querySelectorAll(".game-card"));

const ATTRACT_DELAY = 18000;
const ATTRACT_CARD_INTERVAL = 2200;

let attractTimeout = null;
let attractInterval = null;
let attractIndex = 0;
let firstInteractionDone = false;

/* ===============================
   FULLSCREEN
================================= */

async function goFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreenText(true);
    }
  } catch (error) {
    console.warn("Fullscreen bloqueado:", error);
  }
}

async function toggleFullscreen(event) {
  try {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    fullscreenBtn.classList.add("touch-active");

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreenText(true);
    } else {
      await document.exitFullscreen();
      setFullscreenText(false);
    }
  } catch (error) {
    console.error("No se pudo activar pantalla completa:", error);
  } finally {
    setTimeout(() => {
      fullscreenBtn.classList.remove("touch-active");
    }, 180);
  }
}

function setFullscreenText(isFullscreen) {
  const btnText = fullscreenBtn?.querySelector(".btn-text");

  if (btnText) {
    btnText.textContent = isFullscreen
      ? "Salir de pantalla completa"
      : "Pantalla completa";
  }
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", toggleFullscreen);
}

document.addEventListener("fullscreenchange", () => {
  setFullscreenText(!!document.fullscreenElement);
});

/* ===============================
   PRIMER TOQUE → FULLSCREEN
================================= */

function handleFirstInteraction(event) {
  if (firstInteractionDone) return;

  firstInteractionDone = true;
  goFullscreen();
}

window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });

/* ===============================
   MODO ATTRACT (FERIA)
================================= */

function startAttractMode() {
  document.body.classList.add("attract-mode");

  if (attractHint) {
    attractHint.classList.add("visible");
  }

  if (fullscreenBtn) {
    fullscreenBtn.classList.add("is-pulsing");
  }

  if (attractInterval) return;

  attractInterval = setInterval(() => {
    gameCards.forEach((card) => card.classList.remove("attract"));

    if (gameCards.length > 0) {
      gameCards[attractIndex % gameCards.length].classList.add("attract");
      attractIndex++;
    }
  }, ATTRACT_CARD_INTERVAL);
}

function stopAttractMode() {
  document.body.classList.remove("attract-mode");

  if (attractHint) {
    attractHint.classList.remove("visible");
  }

  if (fullscreenBtn) {
    fullscreenBtn.classList.remove("is-pulsing");
  }

  gameCards.forEach((card) => card.classList.remove("attract"));

  if (attractInterval) {
    clearInterval(attractInterval);
    attractInterval = null;
  }
}

function resetAttractTimer() {
  stopAttractMode();

  if (attractTimeout) {
    clearTimeout(attractTimeout);
  }

  attractTimeout = setTimeout(() => {
    startAttractMode();
  }, ATTRACT_DELAY);
}

/* ===============================
   DETECTAR ACTIVIDAD
================================= */

const activityEvents = [
  "pointerdown",
  "pointermove",
  "mousemove",
  "keydown",
  "click"
];

activityEvents.forEach((eventName) => {
  window.addEventListener(eventName, resetAttractTimer, { passive: true });
});

/* ===============================
   EFECTO TOUCH EN TARJETAS
================================= */

gameCards.forEach((card) => {
  card.addEventListener("pointerdown", () => {
    card.classList.add("touch-active");
  });

  card.addEventListener("pointerup", () => {
    setTimeout(() => {
      card.classList.remove("touch-active");
    }, 120);
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("touch-active");
  });
});

/* ===============================
   INICIO
================================= */

resetAttractTimer();