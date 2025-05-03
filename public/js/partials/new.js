async function newPartial(type) {

    if (!type) {
        console.error("Nie podano typu.");
        return;
    }
    switch (type) {
        case "forms": {
            document.getElementById("header").innerHTML += " - Nowy formularz";
            createForm();
            break;
        }
        case "templates": {
            document.getElementById("header").innerHTML += " - Nowy szablon";
            createTemplate();
            break;
        }
        case "fields": {
            document.getElementById("header").innerHTML += " - Nowe pole";
            addNewField();
            break;
        }
        default: {
            console.error("Nieznany typ.");
            return;
        }
    }

}


function createForm() {
    document.getElementById("editor").innerHTML = `
        <input type="text" id="name" placeholder="Nazwa formularza" required/>
        <h3>Dostępne pola</h3>
        <div id="fieldsContainer"></div>
        <button type="button" id="addFieldButton">Dodaj następne pole</button><br>
        <button id="saveButton">Utwórz</button>
        <button id="cancelButton">Anuluj</button>
    `;
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");
    const fieldsContainer = document.getElementById("fieldsContainer");

    fetch(`./api/list?type=fields`)
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się pobrać danych.");
            return response.json();
        })
        .then(data => {
            if (!data) throw new Error("Nie znaleziono danych.");
            const fields = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;

            // Funkcja do pobierania wybranych nazw pól
            const getSelectedFieldNames = () => {
                return Array.from(fieldsContainer.querySelectorAll("select"))
                    .map(select => select.value)
                    .filter(value => value);
            };

            // Tworzenie selecta z polami, blokując już wybrane opcje
            const createFieldSelect = (selectedValue = null) => {
                const select = document.createElement("select");
                select.className = "field";
                select.name = "field";
                select.required = true;

                // Placeholder
                const placeholder = document.createElement("option");
                placeholder.disabled = true;
                placeholder.selected = !selectedValue;
                placeholder.hidden = true;
                placeholder.textContent = "Wybierz pole";
                select.appendChild(placeholder);

                const selected = getSelectedFieldNames();

                fields.forEach(field => {
                    // Pozwól wybrać tylko nieużyte pole lub aktualnie wybrane
                    if (selected.includes(field.field_name) && field.field_name !== selectedValue) return;
                    const option = document.createElement("option");
                    option.value = field.field_name;
                    option.textContent = field.field_name;
                    if (selectedValue && field.field_name === selectedValue) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                // Jeśli nie ma już dostępnych opcji, nie dodawaj selecta
                if (select.options.length <= 1) {
                    return null;
                }

                // Po zmianie wartości – zaktualizuj dostępne opcje w innych selectach
                select.addEventListener("change", () => {
                    updateAllSelects();
                });

                return select;
            };

            // Aktualizacja wszystkich selectów po zmianie
            const updateAllSelects = () => {
                const selected = getSelectedFieldNames();
                const selects = fieldsContainer.querySelectorAll("select");
                selects.forEach(select => {
                    const currentValue = select.value;
                    // Usuń wszystkie opcje oprócz placeholdera
                    while (select.options.length > 1) {
                        select.remove(1);
                    }
                    fields.forEach(field => {
                        if (selected.includes(field.field_name) && field.field_name !== currentValue) return;
                        const option = document.createElement("option");
                        option.value = field.field_name;
                        option.textContent = field.field_name;
                        if (field.field_name === currentValue) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    });
                });
            };

            // Dodaj pierwszy select
            const firstSelect = createFieldSelect();
            if (firstSelect) fieldsContainer.appendChild(firstSelect);

            // Obsługa przycisku dodawania nowego pola
            const addFieldButton = document.getElementById("addFieldButton");
            addFieldButton.addEventListener("click", () => {
                const selectsCount = fieldsContainer.querySelectorAll("select").length;
                if (selectsCount >= fields.length) {
                    addFieldButton.disabled = true;
                    alert("Wszystkie pola zostały już dodane.");
                    return;
                }
                const newSelect = createFieldSelect();
                if (newSelect) {
                    fieldsContainer.appendChild(newSelect);
                    updateAllSelects();
                }
            });
        })
        .catch(error => {
            console.error("Błąd:", error);
            document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
        });

    saveButton.addEventListener("click", async function () {
        const name = document.getElementById("name").value;
        const selectedFields = Array.from(fieldsContainer.querySelectorAll("select"))
            .map(select => select.value)
            .filter(value => value);
        // Walidacja unikalności pól
        if (new Set(selectedFields).size !== selectedFields.length) {
            alert("Każde pole może być wybrane tylko raz.");
            return;
        }
        const payload = {
            form_name: name,
            data: selectedFields,
        };
        if (!name) {
            alert("Nie można zapisać pustego pola.");
            return;
        }
        try {
            const response = await fetch(`./api/create?type=forms`, {
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

function createTemplate() {
    document.getElementById("editor").innerHTML = `
          <input type="text" id="name" placeholder="Nazwa szablonu" required/>
          <div id="availableFields">
          <h3>Dostępne pola</h3>
          <div id="availableFieldsContainer"></div>
          </div>
          <textarea name="templateContent" id="templateContent" rows=20 placeholder="Lorem ipsum" required></textarea>
          <button id="saveButton">Utwórz</button>
          <button id="cancelButton">Anuluj</button>
        `;
    fetch(`./api/list?type=fields`)
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się pobrać danych.");
            return response.json();
        })
        .then(data => {
            if (!data) throw new Error("Nie znaleziono danych.");
            const fields = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
            const availableFieldsContainer = document.getElementById("availableFieldsContainer");
            fields.forEach(field => {
                const addFieldButton = document.createElement("button");
                addFieldButton.textContent = `Dodaj ${field.field_name}`;
                addFieldButton.type = "button";
                addFieldButton.addEventListener("click", function () {
                    const templateContent = document.getElementById("templateContent");
                    const cursorPos = templateContent.selectionStart;
                    const textBefore = templateContent.value.substring(0, cursorPos);
                    const textAfter = templateContent.value.substring(cursorPos);
                    templateContent.value = `${textBefore}{${field.field_name}}${textAfter}`;
                    templateContent.focus();
                    templateContent.setSelectionRange(cursorPos + field.field_name.length + 4, cursorPos + field.field_name.length + 4);
                });
                availableFieldsContainer.appendChild(addFieldButton);
            });
        })
        .catch(error => {
            console.error("Błąd:", error);
            document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
        });
        const saveButton = document.getElementById("saveButton");
        const cancelButton = document.getElementById("cancelButton");
        saveButton.addEventListener("click", async function () {
            const content = document.getElementById("templateContent").value;
            const name = document.getElementById("name").value;
            const payload = {
                data: content,
                template_name: name
            };
            console.log(payload);
            if (!name) {
                alert("Nie można zapisać pustego pola.");
                return;
            }
            if (!content) {
                alert("Nie można zapisać pustego szablonu.");
                return;
            }
            try {
                const response = await fetch(`./api/create?type=templates`, {
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


function addNewField() {
    document.getElementById("editor").innerHTML = `
          <div id="fields">
          <input type="text" class="name" placeholder="Nazwa pola" required/>
          </div>
          <button type="button" id="addFieldButton">Dodaj następne pole</button><br>
          <button id="saveButton">Utwórz</button>
          <button id="cancelButton">Anuluj</button>
        `;
    const fieldsContainer = document.getElementById("fields");
    const addFieldButton = document.getElementById("addFieldButton");
    addFieldButton.addEventListener("click", function () {
        const newField = document.createElement("input");
        newField.type = "text";
        newField.className = "name";
        newField.placeholder = "Nazwa pola";
        newField.required = true;
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
            const response = await fetch(`./api/create?type=fields`, {
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