document.addEventListener("DOMContentLoaded", function () {
  const modeForm = document.getElementById("modeForm");
  const savedData = document.getElementById("savedData");
  if (!modeForm) {
    console.error("modeForm element not found");
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
        fetch(`./api/list?type=${mode}`)
          .then((response) => response.json())
          .then((data) => {
            data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
            const table = data.map((data) => {
              return `<tr>
                <td>${data.id || "Brak ID"}</td>
                <td>${data.form_name || "<i>Brak nazwy</i>"}</td>
                <td>${data.data || "Brak danych"}</td>
                <td>${data.created_at || "Brak daty"}</td>
                <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
              </tr>`;
            }).join("");
            loadTable(mode, table, `${mode}Table`)
              .then(() => {
                deleteData(mode);
              })
              .catch((error) => {
                console.error("Błąd podczas ładowania modułu table.js:", error);
              });
          });
        break;
      }
      case "templates": {
        fetch(`./api/list?type=${mode}`)
          .then((response) => response.json())
          .then((data) => {
            data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
            const table = data.map((data) => {
              return `<tr>
                <td>${data.id || "Brak ID"}</td>
                <td>${data.template_name || "<i>Brak nazwy</i>"}</td>
                <td>${data.data || "Brak danych"}</td>
                <td>${data.created_at || "Brak daty"}</td>
                <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
              </tr>`;
            }).join("");
            loadTable(mode, table, `${mode}Table`)
              .then(() => {
                deleteData(mode);
              })
              .catch((error) => {
                console.error("Błąd podczas ładowania modułu table.js:", error);
              });
          });
        break;
      }
      case "fields": {
        fetch(`./api/list?type=${mode}`)
          .then((response) => response.json())
          .then((data) => {
            data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
            const table = data.map((data) => {
              return `<tr>
                <td>${data.id || "Brak ID"}</td>
                <td>${data.field_name || "<i>Brak nazwy</i>"}</td>
                <td><a href="./editor?type=${mode}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button type="button" class="deleteButton" value="${data.id}">Usuń</button></td>
              </tr>`;
            }).join("");
            loadTable(mode, table, `${mode}Table`)
              .then(() => {
                deleteData(mode);
              })
              .catch((error) => {
                console.error("Błąd podczas ładowania modułu table.js:", error);
              });
          });
        break;
      }
    }
  });

  async function loadTable(type, table, tableID) {
    try {
      const module = await import("./partials/table.js");
      const getTable = module.default;
      savedData.innerHTML = getTable(type, table, tableID);
    } catch (error) {
      console.error("Błąd podczas wczytywania tabeli:", error);
    }
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
  savedData.innerHTML = `<p>Wybierz typ z listy, aby zobaczyć dane.</p>`;
});