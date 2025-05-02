document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const mode = params.get("mode");
    const id = params.get("id");
    if (!mode) {
      document.getElementById("editor").textContent = "Nie podano trybu.";
      return;
    }
    if (mode !== "edit" && mode !== "new") {
      document.getElementById("editor").textContent = "Nieprawidłowy tryb.";
      return;
    }
    if (!type) {
      document.getElementById("editor").textContent = "Nie podano typu.";
      return;
    }
    if (type !== "forms" && type !== "templates" && type !== "fields") {
      document.getElementById("editor").textContent = "Nieprawidłowy typ.";
      return;
    }
    if (mode === "edit" && !id) {
      document.getElementById("editor").textContent = "Nie podano identyfikatora.";
      return;
    }
    
    if (mode === "edit") {
      try {
        const { default: editPartial } = await import("./partials/edit.js");
        editPartial(type, id);
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    }
    else if (mode === "new") {
      try {
        const { default: newPartial } = await import("./partials/new.js");
        newPartial(type);
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    }
  });
