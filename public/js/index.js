document.addEventListener("DOMContentLoaded", function () {
  const modeForm = document.getElementById("modeForm");
  const savedData = document.getElementById("savedData");
  if (!modeForm) {
    console.error("modeForm element not found");
    return;
  }
  if (!main) {
    console.error("main element not found");
    return;
  }

  modeForm.addEventListener("click", async function (e) {
    if (!e.target.matches("button")) return; // Ignoruj kliknięcia poza przyciskami
    const mode = e.target.value;

    // Zarządzanie klasą 'selected'
    Array.from(modeForm.querySelectorAll("button")).forEach((button) => {
      button.classList.remove("selected");
    });
    e.target.classList.add("selected");

    switch (mode) {
      case "forms": {
        const response = await fetch(`./api/list?type=${mode}`);
        if (!response.ok) {
          //throw new Error("Nie udało się pobrać danych.");
          savedData.innerHTML = `<p>Nie udało się pobrać danych bądź ich brak. Dodaj nowe</p><br>${addCreateButton(mode)}`;
        }
        let data = await response.json();
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
          // Formatowanie danych dla formularzy - konwersja tablicy pól na czytelny tekst
          let displayData = data.data;
          if (typeof displayData === 'string' && displayData.startsWith('[')) {
            try {
              // Próba parsowania JSON w przypadku tablicy pól
              const fieldsArray = JSON.parse(displayData);
              if (Array.isArray(fieldsArray)) {
                displayData = fieldsArray.join(', ');
              }
            } catch (e) {
              // Jeśli parsowanie się nie powiedzie, zachowaj oryginalną wartość
              console.log("Nie udało się sparsować danych:", e);
            }
          }
          
          return `<tr>
                    <td>${data.id || "Brak ID"}</td>
                    <td>${data.form_name || "<i>Brak nazwy</i>"}</td>
                    <td class="limited-cell">${limitText(displayData || "Brak danych", 50)}</td>
                    <td>${data.created_at || "Brak daty"}</td>
                    <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
                  </tr>`;
        }).join("");
        await loadTable(mode, table, `${mode}Table`);
        addCreateButton(mode);
        deleteData(mode);
        break;
      }
      case "templates": {
        const response = await fetch(`./api/list?type=${mode}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych.");
        }
        let data = await response.json();
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
          return `<tr>
                    <td>${data.id || "Brak ID"}</td>
                    <td>${data.template_name || "<i>Brak nazwy</i>"}</td>
                    <td class="limited-cell">${limitText(data.data || "Brak danych", 75)}</td>
                    <td>${data.created_at || "Brak daty"}</td>
                    <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
                  </tr>`;
        }).join("");
        await loadTable(mode, table, `${mode}Table`);
        addCreateButton(mode);
        deleteData(mode);
        break;
      }
      case "fields": {
        const response = await fetch(`./api/list?type=${mode}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych.");
        }
        let data = await response.json();
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
          return `<tr>
                <td>${data.id || "Brak ID"}</td>
                <td>${data.field_name || "<i>Brak nazwy</i>"}</td>
                <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
              </tr>`;
        }).join("");
        await loadTable(mode, table, `${mode}Table`);
        addCreateButton(mode);
        deleteData(mode);
        break;
      }
    }
  });



  savedData.innerHTML = `<p>Wybierz typ z listy, aby zobaczyć dane.</p>`;



  async function loadTable(type, table, tableID) {
    try {
      const module = await import("./partials/table.js");
      const getTable = module.default;
      savedData.innerHTML = getTable(type, table, tableID);
    } catch (error) {
      console.error("Błąd podczas wczytywania tabeli:", error);
    }
  }

  function addCreateButton(type) {
    const oldButton = document.getElementById("createButton");
    if (oldButton) {
      oldButton.remove();
    }
    const createButton = document.createElement("button");
    createButton.id = "createButton";
    if (type === "fields") {
      createButton.textContent = "Dodaj nowe pole";
    }
    else if (type === "forms") {
      createButton.textContent = "Dodaj nowy formularz";
    }
    else if (type === "templates") {
      createButton.textContent = "Dodaj nowy szablon";
    }
    createButton.addEventListener("click", function () {
      window.location.href = `./editor?type=${type}&mode=new`;
    });
    savedData.insertAdjacentElement("afterend",createButton);
  }

  async function deleteData(type) {
    const deleteButtons = document.getElementsByClassName("deleteButton");
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", async function (e) {
        const id = e.target.value;
        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          try {
            const response = await fetch(`./api/delete?type=${type}&id=${id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error("Nie udało się usunąć elementu.");
            }
            alert("Element został usunięty.");
            // Odswiezanie listy bez przeładowania strony
            const updatedData = await fetch(`./api/list?type=${type}`).then((res) => res.json());
            const updatedTable = Array.isArray(updatedData) && Array.isArray(updatedData[0]) ? updatedData[0] : updatedData;
            const table = updatedTable.map((data) => {
              if (type === "forms" || type === "templates") {
                return `<tr>
                  <td>${data.id || "Brak ID"}</td>
                  <td>${data.form_name || data.template_name || "<i>Brak nazwy</i>"}</td>
                  <td>${data.data || "Brak danych"}</td>
                  <td>${data.created_at || "Brak daty"}</td>
                  <td><a href="./editor?type=${type}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
                </tr>`;
              }
              if (type === "fields") {
                return `<tr>
                  <td>${data.id || "Brak ID"}</td>
                  <td>${data.field_name || "<i>Brak nazwy</i>"}</td>
                  <td><a href="./editor?type=${type}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
                </tr>`;
              }
            }).join("");
            console.log(type);
            await loadTable(type, table, `${type}Table`);
            deleteData(type); // Ponowne przypisanie eventów do przycisków
          } catch (error) {
            console.error("Błąd:", error);
            alert(`Nie udało się usunąć elementu. Szczegóły: ${error.message}`);
          }
        }
      });
    }
  }


  function limitText(text, maxLength = 75) {
    if (text && text.length > maxLength) {
      return `<span class="limited-text" title="${text.replace(/"/g, '&quot;')}">${text.substring(0, maxLength)}...</span>`;
    }
    return text;
  }
  

});