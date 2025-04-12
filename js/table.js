export default function getTable(table, tableID) {
    return `
        <table id="${tableID}">
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
}