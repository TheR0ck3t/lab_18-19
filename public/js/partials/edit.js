async function editPartial(type, id) {
    try {
        const response = await fetch(`./api/load?type=${type}&id=${id}`);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych.");
        }
        const data = await response.json();
        document.getElementById("editor").innerHTML = `
          <h2 id="name">${data.form_name || data.template_name}</h2>
          <textarea name="templateContent" id="templateContent" cols="100" rows="20">${data.data}</textarea>
          <button id="saveButton">Aktualizuj</button>
          <button id="cancelButton">Anuluj</button>
        `;
      } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
      }
    
      const saveButton = document.getElementById("saveButton");
      const cancelButton = document.getElementById("cancelButton");
      saveButton.addEventListener("click", async function () {
        const content = document.getElementById("templateContent").value;
        const name = document.getElementById("name").textContent;
        console.log(name);
        const payload = {
          data: content,
        };
        if (type === "forms") {
          payload.form_name = name;
        } else if (type === "templates") {
          payload.template_name = name;
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
            window.location.href = `./index`;
          }
        } catch (error) {
          console.error("Błąd:", error);
          alert(`Nie udało się zapisać danych. Szczegóły: ${error.message}`);
        }
      });
      cancelButton.addEventListener("click", function () {
        window.location.href = `./index`;
      });
};

export default editPartial;