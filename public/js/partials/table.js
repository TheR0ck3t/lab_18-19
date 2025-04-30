export default function getTable(type, table, tableID) {
    if (type === "forms" || type === "templates") {
        return `
            <table id="${tableID}">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Treść</th>
                    <th>Utworzono</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  ${table}
                </tbody>
            </table>`;
    }
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