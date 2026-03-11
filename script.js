const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const attractMode = document.getElementById("attractMode");
const appShell = document.getElementById("appShell");

const IDLE_MS = 20000;

let idleTimer = null;
let firstInteractionHandled = false;

function updateDateTime() {
  const now = new Date();

  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  };

  const formattedDate = now.toLocaleDateString("es-GT", dateOptions);
  const formattedTime = now.toLocaleTimeString("es-GT", timeOptions);

  currentDate.textContent =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  currentTime.textContent = formattedTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);

async function toggleFullscreen() {
  const target = appShell || document.documentElement;

  try {
    if (!document.fullscreenElement) {
      await target.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error("No se pudo activar la pantalla completa:", error);
  }
}

function updateFullscreenButton() {
  if (!fullscreenBtn) return;

  fullscreenBtn.textContent = document.fullscreenElement
    ? "🡼 Salir pantalla completa"
    : "⛶ Pantalla completa";
}

fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
updateFullscreenButton();

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

  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  idleTimer = setTimeout(() => {
    showAttractMode();
  }, IDLE_MS);
}

async function handleFirstInteraction() {
  if (firstInteractionHandled) return;
  firstInteractionHandled = true;

  if (!document.fullscreenElement) {
    try {
      const target = appShell || document.documentElement;
      await target.requestFullscreen();
    } catch (error) {
      // si el navegador no lo permite, queda el botón manual
    }
  }

  updateFullscreenButton();
}

function onAnyInteraction() {
  handleFirstInteraction();
  resetIdleTimer();
}

["pointerdown", "pointermove", "touchstart", "keydown", "mousemove"].forEach((eventName) => {
  window.addEventListener(eventName, onAnyInteraction, { passive: true });
});

resetIdleTimer();