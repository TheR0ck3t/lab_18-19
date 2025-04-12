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
              <td><button value="${data.id}">Wczytaj</button></td
              </tr>`;
        }).join("");
        loadTable(table, `${e.target.value}Table`)
        .then(() => {
          loadData(e.target.value);
        })
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
              <td><button value="${data.id}">Wczytaj</button></td
              </tr>`;
        }).join("");
        loadTable(table, `${e.target.value}Table`)
        .then(() => {
          loadData(e.target.value);
        })
        .catch((error) => {
            console.error("Błąd podczas ładowania modułu table.js:", error);
        });
      })
      break;
    };
  }});
        
        
async function loadTable(table, tableID) {
  try {
    const module = await import("./table.js");
    const getTable = module.default;
    savedData.innerHTML = getTable(table, tableID);
  } catch (error) {
    console.error("Błąd podczas wczytywania tabeli:", error);
    
  }
}

async function loadData(type) {
  const table = document.getElementById(`${type}Table`);
  if (!table) {
    console.error(`${type} Table element not found`);
    return;
  }
  const buttons = table.querySelectorAll("button");
  if (!buttons) {
    console.error("No buttons found in the table");
    return;
  }
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      fetch(`./api/load?type=${type}&id=${e.target.value}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
    })
  })
  }})
