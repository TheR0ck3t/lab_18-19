async function editPartial(type, id) {
    try {
        const response = await fetch(`./api/load?type=${type}&id=${id}`);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych.");
        }
        const data = await response.json();
        if (!data) {
          throw new Error("Nie znaleziono danych.");
        }
        const editor = document.getElementById("editor")
        switch (type) {
          case "templates":
            editor.innerHTML = `
              <h2>Edytuj szablon</h2>
              <div id="name">Nazwa szablonu: ${data.template_name}</div>
              <textarea id="content" rows="10" cols="50">${data.data}</textarea>
              <button id="saveButton">Zapisz</button>
              <button id="cancelButton">Anuluj</button>
            `;
            break;
          case "fields":
            editor.innerHTML = `
              <h2>Edytuj pole</h2>
              <div id="name">Stara nazwa pola: ${data.field_name}</div>
              <input type="text" id="content" value="" placeholder="Nowa nazwa" />
              <button id="saveButton">Zapisz</button>
              <button id="cancelButton">Anuluj</button>
            `;
            break;
          default:
            throw new Error("Nieznany typ.");
        }
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    
      const saveButton = document.getElementById("saveButton");
      const cancelButton = document.getElementById("cancelButton");
      saveButton.addEventListener("click", async function () {
        const content = document.getElementById("content").value;
        const name = document.getElementById("name").textContent;
        console.log(name);
        const payload = {};
        switch (type) {
          case "forms":
            payload.data = content;
            payload.form_name = name;
            break;
          case "templates":
            payload.data = content;
            payload.template_name = name;
            break;
          case "fields":
            payload.field_name = content;
            break;
          default:
            console.error("Nieznany typ.");
            return;
        }
        if (!content) {
          alert("Nie można zapisać pustego szablonu.");
          return;
        }
        if (type === "forms" && !name) {
          alert("Nie można zapisać formularza bez nazwy.");
          return;
        }
        if (type === "templates" && !name) {
          alert("Nie można zapisać szablonu bez nazwy.");
          return;
        }
        if (type === "fields" && !content) {
          alert("Nie można zaktualizować pustego pola.");
          return;
        }
        try {
          const response = await fetch(`./api/update?type=${type}&id=${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Błąd podczas zapisywania danych. Status: ${response.status}, Szczegóły: ${errorText}`);
          }
          if (response.ok) {
            alert("Dane zostały zapisane pomyślnie.");
            window.location.href = `./`;
          }
        } catch (error) {
          console.error("Błąd:", error);
          alert(`Nie udało się zapisać danych. Szczegóły: ${error.message}`);
        }
      });
      cancelButton.addEventListener("click", function () {
        window.location.href = `./`;
      });
};

export default editPartial;