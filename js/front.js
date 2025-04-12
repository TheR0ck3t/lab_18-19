document.addEventListener("DOMContentLoaded", function () {

modeForm = document.getElementById("modeForm");
if (!modeForm) {
  console.error("modeForm element not found");
  return;
}
modeForm.addEventListener("change", async function (e) {

  switch (e.target.value) {
    case "forms": {
      fetch("./api/list?type=forms")
      .then((response) => response.json())
      .then((data) => {
        const savedData = document.getElementById("savedData");
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
        savedData.innerHTML = `
            <table id="formsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nazwa</th>
                <th>Pola</th>
                <th>Utworzono</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              ${table}
            </tbody>
            </table>`;
            loadData(e.target.value);})

      break;
    };
    case "templates": {
      fetch("./api/list?type=templates")
      .then((response) => response.json())
      .then((data) => {
        const savedData = document.getElementById("savedData");
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
        savedData.innerHTML = `
            <table id="templatesTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nazwa</th>
                <th>Pola</th>
                <th>Utworzono</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              ${table}
            </tbody>
            </table>`;
            loadData(e.target.value);
    })
      break;
    };
  }

})
async function loadData(type) {
  const table = document.getElementById(`${type}Table`);
  if (!table) {
    console.error(`${type}Table element not found`);
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
}
})