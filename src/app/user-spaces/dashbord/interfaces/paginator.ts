export interface Paginator {
  // pageEvent: Function;
  // datasource: any[];
  // pageIndex: number;
  // pageSize: number;
  // length: number;

  previousPageIndex: number,
  pageIndex: number,
  pageSize: number,
  length: number,
  pageSizeOptions: number[],
  showTotalPages: number
}
