import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

const UPDATE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;

/**
 * Muestra un toast interactivo (abajo a la derecha) cuando hay una actualización disponible.
 * El toast tiene dos botones: "Actualizar ahora" y "Más tarde".
 */
function showUpdateToast(version: string): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Evitar duplicados si el evento llega más de una vez
  if (document.getElementById("toast-update")) return;

  const toast = document.createElement("div");
  toast.className = "toast update";
  toast.id = "toast-update";

  toast.innerHTML = `
    <div class="toast-header">
      ${UPDATE_ICON}
      <span>Actualización disponible — v${version}</span>
    </div>
    <div class="toast-body">
      Una nueva versión de EstudIO está lista para instalar.
    </div>
    <div class="toast-actions">
      <button class="btn-update-now" id="btn-update-now">Actualizar ahora</button>
      <button class="btn-update-later" id="btn-update-later">Más tarde</button>
    </div>
  `;

  container.appendChild(toast);

  const removeToast = () => {
    toast.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => {
      if (toast.parentNode === container) container.removeChild(toast);
    }, 300);
  };

  // Botón "Más tarde": simplemente cierra el toast
  toast.querySelector<HTMLButtonElement>("#btn-update-later")!
    .addEventListener("click", removeToast);

  // Botón "Actualizar ahora": invoca el comando Rust y desactiva los botones mientras descarga
  toast.querySelector<HTMLButtonElement>("#btn-update-now")!
    .addEventListener("click", async () => {
      const btnNow = toast.querySelector<HTMLButtonElement>("#btn-update-now")!;
      const btnLater = toast.querySelector<HTMLButtonElement>("#btn-update-later")!;

      btnNow.textContent = "Descargando…";
      btnNow.disabled = true;
      btnLater.disabled = true;

      try {
        await invoke("instalar_actualizacion");
        // La app se reinicia automáticamente, pero si por algún motivo no lo hace:
        removeToast();
      } catch (err) {
        console.error("[updater] Error al instalar actualización:", err);
        btnNow.textContent = "Error — reintentar";
        btnNow.disabled = false;
        btnLater.disabled = false;
      }
    });
}

/**
 * Inicializa el listener del evento "update-available" emitido desde Rust.
 * Debe llamarse una sola vez al arrancar la app.
 */
export async function initUpdater(): Promise<void> {
  await listen<string>("update-available", (event) => {
    showUpdateToast(event.payload);
  });
}
