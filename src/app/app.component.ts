import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;
  title = 'ag-gird-example';

  columnDefs = [
    { headerName: 'make', field: 'make', sortable: true, filter: true, checkboxSelection: true },
    { headerName: 'model', field: 'model', sortable: true, filter: true },
    { headerName: 'price', field: 'price', sortable: true, filter: true }
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];
  defaultColDef = {
    editable: true,
    resizable: true
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
  }

  save() {
    var count = this.gridApi.getDisplayedRowCount();
    console.log("## printAllDisplayedRows");
    for (var i = 0; i < count; i++) {
      var rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      console.log("row " + i + " is " + JSON.stringify(rowNode.data));
    }
  }

}
