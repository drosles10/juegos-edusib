/* =========================================================
   MENU PRINCIPAL KIOSKO TOUCH 65"
   Optimizado para pantalla interactiva Android / 4K
========================================================= */

const KIOSK = {
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,
  inputLocked: false,
  lockMs: 450,
  resizeRaf: null,
  idleSeconds: 20,
  idleTimer: null,
  fullscreenTried: false
};

const fullscreenBtn = document.getElementById("fullscreenBtn");
const attractMode = document.getElementById("attractMode");
const currentDateEl = document.getElementById("currentDate");
const currentTimeEl = document.getElementById("currentTime");

/* ===== VIEWPORT REAL ===== */
function setRealViewportHeight() {
  const realHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const vh = realHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

/* ===== ESCALA INTERNA 1920x1080 ===== */
function fitGameToScreen() {
  const shell = document.getElementById("game-shell");
  if (!shell) return;

  const ww = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const wh = window.innerHeight || document.documentElement.clientHeight || screen.height;

  const scaleX = ww / KIOSK.BASE_WIDTH;
  const scaleY = wh / KIOSK.BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  document.documentElement.style.setProperty("--game-scale", scale.toString());

  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

/* ===== RECÁLCULO FUERTE ===== */
function forceReflowResize() {
  setRealViewportHeight();
  fitGameToScreen();

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 120);

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 350);

  setTimeout(() => {
    setRealViewportHeight();
    fitGameToScreen();
  }, 700);
}

/* ===== RESIZE OPTIMIZADO ===== */
function handleResizeOptimized() {
  if (KIOSK.resizeRaf) cancelAnimationFrame(KIOSK.resizeRaf);

  KIOSK.resizeRaf = requestAnimationFrame(() => {
    forceReflowResize();
  });
}

/* ===== BLOQUEAR GESTOS PROBLEMÁTICOS ===== */
function blockProblematicGestures() {
  document.addEventListener(
    "gesturestart",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener(
    "dblclick",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

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

/* ===== SAFE TAP ===== */
function safeTap(handler, delay = KIOSK.lockMs) {
  return function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (KIOSK.inputLocked) return;
    KIOSK.inputLocked = true;

    try {
      handler(event);
    } catch (error) {
      console.error("Error en safeTap:", error);
    }

    setTimeout(() => {
      KIOSK.inputLocked = false;
    }, delay);
  };
}

/* ===== FECHA Y HORA ===== */
function updateDateTime() {
  const now = new Date();

  const dateText = new Intl.DateTimeFormat("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  const timeText = new Intl.DateTimeFormat("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(now);

  if (currentDateEl) {
    currentDateEl.textContent =
      dateText.charAt(0).toUpperCase() + dateText.slice(1);
  }

  if (currentTimeEl) {
    currentTimeEl.textContent = timeText;
  }
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
  if (!fullscreenBtn) return;

  if (document.fullscreenElement) {
    fullscreenBtn.textContent = "⛶ Pantalla completa activa";
  } else {
    fullscreenBtn.textContent = "⛶ Pantalla completa";
  }
}

function tryFullscreenOnce() {
  if (KIOSK.fullscreenTried) return;
  KIOSK.fullscreenTried = true;
  enterFullscreen().finally(() => {
    updateFullscreenButtonText();
    forceReflowResize();
  });
}

/* ===== ATTRACT MODE ===== */
function showAttractMode() {
  if (!attractMode) return;
  attractMode.classList.add("show");
  attractMode.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-idle");
}

function hideAttractMode() {
  if (!attractMode) return;
  attractMode.classList.remove("show");
  attractMode.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-idle");
}

function resetIdleTimer() {
  hideAttractMode();

  if (KIOSK.idleTimer) {
    clearTimeout(KIOSK.idleTimer);
  }

  KIOSK.idleTimer = setTimeout(() => {
    showAttractMode();
  }, KIOSK.idleSeconds * 1000);
}

/* ===== PRELOAD SUAVE ===== */
function preloadLogos() {
  const sources = ["assets/edusib.png", "assets/global.png"];
  sources.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  });
}

/* ===== NAVEGACIÓN MÁS ESTABLE ===== */
function setupCardNavigation() {
  const navLinks = document.querySelectorAll('[data-nav="true"]');

  navLinks.forEach((link) => {
    link.addEventListener(
      "click",
      safeTap(() => {
        const href = link.getAttribute("href");
        if (!href) return;

        link.classList.add("is-launching");

        setTimeout(() => {
          window.location.href = href;
        }, 120);
      }),
      { passive: false }
    );
  });
}

/* ===== EVENTOS DE ACTIVIDAD ===== */
function setupActivityListeners() {
  const activityEvents = ["click", "touchstart", "pointerdown", "mousemove", "keydown"];

  activityEvents.forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => {
        resetIdleTimer();
      },
      { passive: true }
    );
  });
}

/* ===== INIT ===== */
function init() {
  setRealViewportHeight();
  fitGameToScreen();
  blockProblematicGestures();
  preloadLogos();
  setupCardNavigation();
  setupActivityListeners();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  resetIdleTimer();
  updateFullscreenButtonText();

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener(
      "click",
      safeTap(async () => {
        await enterFullscreen();
        updateFullscreenButtonText();
        resetIdleTimer();
        forceReflowResize();
      }),
      { passive: false }
    );
  }

  document.addEventListener(
    "pointerdown",
    () => {
      tryFullscreenOnce();
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
      resetIdleTimer();
    }
  });

  setTimeout(forceReflowResize, 100);
  setTimeout(forceReflowResize, 400);
  setTimeout(forceReflowResize, 900);
}

document.addEventListener("DOMContentLoaded", init);