async function newPartial(type) {

    if (!type) {
        console.error("Nie podano typu.");
        return;
    }
    switch (type) {
        case "forms": {
            document.getElementById("header").innerHTML += " - Nowy formularz";
            createFormTemplate(type);
            break;
        }
        case "templates": {
            document.getElementById("header").innerHTML += " - Nowy szablon";
            createFormTemplate(type);
            break;
        }
        case "fields": {
            document.getElementById("header").innerHTML += " - Nowe pole";
            addNewField(type);
            break;
        }
        default: {
            console.error("Nieznany typ.");
            return;
        }
    }

}

function createFormTemplate(type) {
    document.getElementById("editor").innerHTML = `
          <input type="text" id="name" placeholder="Nazwa pliku" required/>
          <textarea name="templateContent" id="templateContent" rows=20 placeholder="Lorem ipsum" required></textarea>
          <button id="saveButton">Utwórz</button>
          <button id="cancelButton">Anuluj</button>
        `;

        const saveButton = document.getElementById("saveButton");
        const cancelButton = document.getElementById("cancelButton");
        saveButton.addEventListener("click", async function () {
            const content = document.getElementById("templateContent").value;
            const name = document.getElementById("name").value;
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
                const response = await fetch(`./api/create?type=${type}`, {
                    method: "POST",
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
}

function addNewField(type) {
    document.getElementById("editor").innerHTML = `
          <div id="fields">
          <input type="text" class="name" placeholder="Nazwa pola" required/>
          </div>
          <button type="button" id="addFieldButton">Dodaj następne pole</button>
          <button id="saveButton">Utwórz</button>
          <button id="cancelButton">Anuluj</button>
        `;
    const fieldsContainer = document.getElementById("fields");
    const addFieldButton = document.getElementById("addFieldButton");
    addFieldButton.addEventListener("click", function () {
        const newField = document.createElement("input");
        newField.className = "name";
        newField.type = "text";
        newField.placeholder = "Nazwa pola";
        fieldsContainer.appendChild(newField);
    });
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");
    saveButton.addEventListener("click", async function () {
        const allInputs = document.querySelectorAll(".name");
        const fieldNames = Array.from(allInputs).map(field => field.value.trim());
        if (fieldNames.length === 0) {
            alert("Dodaj przynajmniej jedno pole.");
            return;
        }
        if (fieldNames.some(name => name === "")) {
            alert("Nie można zapisać pustego pola.");
            return;
        }
        const payload = {
            field_name: fieldNames
        };
        console.log(payload);
        try {
            const response = await fetch(`./api/create?type=${type}`, {
                method: "POST",
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
}

export default newPartial;