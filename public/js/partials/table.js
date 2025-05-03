/**
 * Generuje HTML dla tabeli w zależności od typu zasobu
 * @param {string} type - Typ zasobu: forms, templates lub fields
 * @param {string} table - Zawartość tabeli (wiersze HTML)
 * @param {string} tableID - ID dla elementu tabeli
 * @returns {string} - Kompletny kod HTML dla tabeli
 */
export default function getTable(type, table, tableID) {
    // Tabele dla formularzy i szablonów mają inny układ niż dla pól
    if (type === "forms" || type === "templates") {
      // Określenie nagłówka w zależności od typu
      let header = "";
      if (type === "forms") {
        header = `Pola`;
      }
      else if (type === "templates") {
        header = `Treść`;
      }
        // Struktura tabeli dla formularzy i szablonów
        return `
            <table id="${tableID}">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>${header}</th>
                    <th>Utworzono</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  ${table}
                </tbody>
            </table>`;
    }
    // Struktura tabeli dla pól
    if (type === "fields") {
        return `
            <table id="${tableID}">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  ${table}
                </tbody>
            </table>`;
    }
}