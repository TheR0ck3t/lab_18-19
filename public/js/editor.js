/**
 * Skrypt obsługujący edytor dla różnych typów zasobów (formularze, szablony, pola)
 * Obsługuje tryby 'edit' i 'new' dla tych zasobów
 */
document.addEventListener("DOMContentLoaded", async function () {
    // Pobranie parametrów z URL
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type"); // Typ zasobu (forms, templates, fields)
    const mode = params.get("mode"); // Tryb działania (edit, new)
    const id = params.get("id");     // ID zasobu (tylko dla trybu edit)
    
    // Walidacja parametrów URL
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
    
    // Załadowanie odpowiedniego modułu w zależności od trybu
    if (mode === "edit") {
      try {
        // Załadowanie modułu edycji i wywołanie funkcji edycji
        const { default: editPartial } = await import("./partials/edit.js");
        editPartial(type, id);
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    }
    else if (mode === "new") {
      try {
        // Załadowanie modułu tworzenia nowego zasobu i wywołanie funkcji
        const { default: newPartial } = await import("./partials/new.js");
        newPartial(type);
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    }
  });
