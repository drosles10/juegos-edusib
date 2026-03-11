const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const fullscreenBtn = document.getElementById("fullscreenBtn");

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

fullscreenBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = "Salir de pantalla completa";
    } else {
      await document.exitFullscreen();
      fullscreenBtn.textContent = "Pantalla completa";
    }
  } catch (error) {
    console.error("No se pudo activar la pantalla completa:", error);
  }
});

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    fullscreenBtn.textContent = "Salir de pantalla completa";
  } else {
    fullscreenBtn.textContent = "Pantalla completa";
  }
});