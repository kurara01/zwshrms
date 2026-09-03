(function () {
  "use strict";

  const byId = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  let toastTimer = null;

  function showToast(message, type = "success") {
    const toast = byId("toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast show${type === "error" ? " error" : ""}`;
    toastTimer = setTimeout(() => { toast.className = "toast"; }, 2600);
  }

  function openDialog(id) {
    const dialog = byId(id);
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeDialog(id) {
    const dialog = byId(id);
    if (dialog?.open) dialog.close();
  }

  function initShell() {
    byId("sidebarToggle")?.addEventListener("click", () => byId("sidebar")?.classList.toggle("collapsed"));
    document.querySelectorAll(".nav-group-trigger").forEach(button => button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const items = button.nextElementSibling;
      if (items) items.hidden = expanded;
    }));
    document.addEventListener("click", event => {
      const closeButton = event.target.closest("[data-close]");
      if (closeButton) closeDialog(closeButton.dataset.close);
    });
    document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    }));
  }

  window.PrototypeUI = { byId, escapeHTML, showToast, openDialog, closeDialog, initShell };
  document.addEventListener("DOMContentLoaded", initShell, { once: true });
}());
