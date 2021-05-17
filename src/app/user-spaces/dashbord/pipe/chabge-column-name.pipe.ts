import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chabgeColumnName'
})
export class ChabgeColumnNamePipe implements PipeTransform {

  transform(displayColumns: string[], edidtableColumns: string[]): string {
    console.log(displayColumns, edidtableColumns);

    // const displaIndex = displayColumns.indexOf(column);
    // return edidtableColumns[displaIndex].toString();
    return 'OK'
  }

}