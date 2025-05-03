export default function getTable(type, table, tableID) {
    if (type === "forms" || type === "templates") {
      let header = "";
      if (type === "forms") {
        header = `Pola`;
      }
      else if (type === "templates") {
        header = `Treść`;
      }
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