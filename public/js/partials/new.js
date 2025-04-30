async function newPartial(type) {
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
}

export default newPartial;