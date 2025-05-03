/**
 * Funkcja obsługująca edycję istniejącego elementu (formularza, szablonu lub pola)
 * @param {string} type - Typ zasobu do edycji: forms, templates lub fields
 * @param {number} id - Identyfikator zasobu do edycji
 */
async function editPartial(type, id) {
    try {
        // Pobieranie danych zasobu do edycji
        const response = await fetch(`./api/load?type=${type}&id=${id}`);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych.");
        }
        const data = await response.json();
        if (!data) {
          throw new Error("Nie znaleziono danych.");
        }
        console.log(data);
        const editor = document.getElementById("editor")
        switch (type) {
          case "forms":
            // Generowanie interfejsu edycji formularza
            editor.innerHTML = `
              <h2>Edytuj formularz</h2>
              <h3>Stara nazwa formularza: <span id="name">${data.form_name}</span></h3>
              <input type="text" id="newName" placeholder="Nowa nazwa(opcjonalne)" required/>
              <h3>Dostępne pola</h3>
              <div id="fieldsContainer"></div>
              <button type="button" id="addFieldButton">Dodaj następne pole</button>
              <br>
              <button id="saveButton">Zapisz</button>
              <button id="cancelButton">Anuluj</button>
            `;

            // Pobieranie dostępnych pól
            fetch(`./api/list?type=fields`)
              .then(response => {
                if (!response.ok) throw new Error("Nie udało się pobrać danych.");
                return response.json();
              })
              .then(fieldsData => {
                const fields = Array.isArray(fieldsData) && Array.isArray(fieldsData[0]) ? fieldsData[0] : fieldsData;
                const fieldsContainer = document.getElementById("fieldsContainer");
                const addFieldButton = document.getElementById("addFieldButton");

                // Przygotowanie tablicy wybranych pól
                let selectedFields = [];
                try {
                  selectedFields = Array.isArray(data.data)
                    ? data.data
                    : JSON.parse(data.data);
                } catch {
                  selectedFields = [];
                }

                // Tworzenie selecta z polami, blokując już wybrane opcje (poza aktualnym selectem)
                const createFieldSelect = (selectedValue = null) => {
                  const wrapper = document.createElement("div");
                  wrapper.style.display = "flex";
                  wrapper.style.alignItems = "center";
                  wrapper.style.gap = "0.5em";

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

                  // Dodajemy wszystkie dostępne pola do selecta
                  fields.forEach(field => {
                    const option = document.createElement("option");
                    option.value = field.field_name;
                    option.textContent = field.field_name;
                    if (selectedValue && field.field_name === selectedValue) {
                      option.selected = true;
                    }
                    select.appendChild(option);
                  });

                  select.addEventListener("change", () => {
                    updateAllSelects();
                  });

                  // Przycisk usuwania konkretnego pola
                  const removeBtn = document.createElement("button");
                  removeBtn.type = "button";
                  removeBtn.textContent = "Usuń";
                  removeBtn.addEventListener("click", () => {
                    fieldsContainer.removeChild(wrapper);
                    addFieldButton.disabled = false;
                    updateAllSelects();
                  });

                  wrapper.appendChild(select);
                  wrapper.appendChild(removeBtn);

                  return wrapper;
                };

                // Aktualizacja wszystkich selectów po zmianie
                const updateAllSelects = () => {
                  const selects = Array.from(fieldsContainer.querySelectorAll("select"));
                  
                  // Pobierz aktualnie wybrane wartości
                  const selectedValues = selects.map(s => s.value).filter(v => v);
                  
                  // Dla każdego selecta, dodaj tylko niewybrane opcje
                  selects.forEach(select => {
                    const currentValue = select.value;
                    
                    // Znajdź opcje wybrane w innych selectach
                    const otherSelectedValues = selectedValues.filter(v => v !== currentValue);
                    
                    // Usuń wszystkie opcje oprócz placeholdera
                    while (select.options.length > 1) {
                      select.remove(1);
                    }
                    
                    // Dodaj tylko opcje, które nie są wybrane gdzie indziej
                    fields.forEach(field => {
                      // Jeśli to pole jest już wybrane w innym selekcie, pomijamy je
                      if (otherSelectedValues.includes(field.field_name)) return;
                      
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

                // Dodaj selecty dla już wybranych pól
                selectedFields.forEach(fieldName => {
                  const wrapper = createFieldSelect(fieldName);
                  if (wrapper) fieldsContainer.appendChild(wrapper);
                });

                // Jeśli nie było żadnego pola, dodaj jeden select
                if (fieldsContainer.childElementCount === 0) {
                  const wrapper = createFieldSelect();
                  if (wrapper) fieldsContainer.appendChild(wrapper);
                }

                // Wykonaj pierwsze uaktualnienie, aby zablokować już wybrane opcje
                updateAllSelects();

                // Obsługa przycisku dodawania nowego pola
                addFieldButton.addEventListener("click", () => {
                  const selectsCount = fieldsContainer.querySelectorAll("select").length;
                  if (selectsCount >= fields.length) {
                    addFieldButton.disabled = true;
                    alert("Wszystkie pola zostały już dodane.");
                    return;
                  }
                  const wrapper = createFieldSelect();
                  if (wrapper) {
                    fieldsContainer.appendChild(wrapper);
                    updateAllSelects();
                  }
                });
              })
              .catch(error => {
                console.error("Błąd:", error);
                document.getElementById("editor").textContent = "Nie udało się wczytać pól.";
              });
            break;
          case "templates":
            // Generowanie interfejsu edycji szablonu
            editor.innerHTML = `
              <h2>Edytuj szablon</h2>
              <h3>Stara nazwa formularza: <span id="name">${data.template_name}</span></h3>
              <input type="text" id="newName" placeholder="Nowa nazwa(opcjonalne)" required/>
              <h3>Treść szablonu</h3>
              <div id="availableFields">
              <h3>Dostępne pola</h3>
              <div id="availableFieldsContainer"></div>
              </div>
              <textarea id="content" rows="10" cols="50">${data.data}</textarea>
              <button id="saveButton">Zapisz</button>
              <button id="cancelButton">Anuluj</button>
            `;
            // Pobieranie dostępnych pól do użycia w szablonie
            fetch(`./api/list?type=fields`)
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się pobrać danych.");
            return response.json();
        })
        .then(data => {
            if (!data) throw new Error("Nie znaleziono danych.");
            const fields = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
            const availableFieldsContainer = document.getElementById("availableFieldsContainer");
            // Tworzenie przycisków do wstawiania pól w szablonie
            fields.forEach(field => {
                const addFieldButton = document.createElement("button");
                addFieldButton.textContent = `Dodaj ${field.field_name}`;
                addFieldButton.type = "button";
                addFieldButton.addEventListener("click", function () {
                    const content = document.getElementById("content");
                    const cursorPos = content.selectionStart;
                    const textBefore = content.value.substring(0, cursorPos);
                    const textAfter = content.value.substring(cursorPos);
                    content.value = `${textBefore}{${field.field_name}}${textAfter}`;
                    content.focus();
                    content.setSelectionRange(cursorPos + field.field_name.length + 4, cursorPos + field.field_name.length + 4);
                });
                availableFieldsContainer.appendChild(addFieldButton);
            });
        })
        .catch(error => {
            console.error("Błąd:", error);
            document.getElementById("editor").textContent = "Nie udało się wczytać danych.";
        });
            break;
          case "fields":
            // Generowanie interfejsu edycji pola
            editor.innerHTML = `
              <h2>Edytuj pole</h2>
              <h3 id="name">Stara nazwa pola: ${data.field_name}</h3>
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
    
      // Dodanie obsługi przycisków Zapisz i Anuluj
      const saveButton = document.getElementById("saveButton");
      const cancelButton = document.getElementById("cancelButton");
      saveButton.addEventListener("click", async function () {
        // Pobranie wartości z pól formularza
        const content = document.getElementById("content") ? document.getElementById("content").value : null;
        let name = document.getElementById("name").textContent;
        const newName = document.getElementById("newName") ? document.getElementById("newName").value : null;
        if (newName !== "") {
          name = newName;
        }
        
        // Przygotowanie danych do wysłania w zależności od typu
        const payload = {};
        switch (type) {
          case "forms":
            payload.data = Array.from(document.querySelectorAll("#fieldsContainer select"))
              .map(select => select.value)
              .filter(value => value);
            payload.form_name = name;
            payload.old_form_name = newName;
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
        
        // Walidacja danych
        if (!content && type !== "forms") {
          alert("Nie można zapisać pustego szablonu.");
          return;
        }
        if (type === "forms" && (!name || !payload.data.length)) {
          alert("Nie można zapisać formularza bez nazwy lub bez pól.");
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
          // Wysłanie danych do API
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
      
      // Obsługa przycisku Anuluj
      cancelButton.addEventListener("click", function () {
        window.location.href = `./`;
      });
};

export default editPartial;