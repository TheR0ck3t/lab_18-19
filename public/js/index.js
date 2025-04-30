document.addEventListener("DOMContentLoaded", function () {
modeForm = document.getElementById("modeForm");
const savedData = document.getElementById("savedData");
if (!modeForm) {
  console.error("modeForm element not found");
  return;
}
modeForm.addEventListener("change", async function (e) {
  switch (e.target.value) {
    case "forms": {
      fetch(`./api/list?type=${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
            return `<tr>
              <td>${data.id || "Brak ID"}</td>
              <td>${data.form_name || "<i>Brak nazwy</i>"}</td>
              <td>${data.data || "Brak danych"}</td>
              <td>${data.created_at || "Brak daty"}</td>
              <td><a href="./editor?type=${e.target.value}&mode=edit&id=${data.id}"><button value="${data.id}">Wczytaj</button></a></td
              </tr>`;
        }).join("");
        loadTable(e.target.value, table, `${e.target.value}Table`)
        .catch((error) => {
            console.error("Błąd podczas ładowania modułu table.js:", error);
        });
      });
      break;
    };
    case "templates": {
      fetch(`./api/list?type=${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
            return `<tr>
              <td>${data.id || "Brak ID"}</td>
              <td>${data.template_name || "<i>Brak nazwy</i>"}</td>
              <td>${data.data || "Brak danych"}</td>
              <td>${data.created_at || "Brak daty"}</td>
              <td><a href="./editor?type=${e.target.value}&mode=edit&id=${data.id}"><button value="${data.id}">Wczytaj</button></a></td
              </tr>`;
        }).join("");
        loadTable(e.target.value, table, `${e.target.value}Table`)
        .catch((error) => {
            console.error("Błąd podczas ładowania modułu table.js:", error);
        });
      })
      break;
    };
    case "fields" : {
      fetch(`./api/list?type=${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        data = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        const table = data.map((data) => {
            return `<tr>
              <td>${data.id || "Brak ID"}</td>
              <td>${data.field_name || "<i>Brak nazwy</i>"}</td>
              <td><a href="./editor?type=${e.target.value}&mode=edit&id=${data.id}"><button value="${data.id}">Edytuj</button></a><button value ${data.id}>Usuń</button></td
              </tr>`;
        }).join("");
        console.log (e.target.value)
        loadTable(e.target.value, table, `${e.target.value}Table`)
        .catch((error) => {
            console.error("Błąd podczas ładowania modułu table.js:", error);
        });
      })
      break;
    }
  }});
        
        
async function loadTable(type, table, tableID) {
  try {
    const module = await import("./partials/table.js");
    const getTable = module.default;
    savedData.innerHTML = getTable(type,table, tableID);
  } catch (error) {
    console.error("Błąd podczas wczytywania tabeli:", error);
    
  }
}
})