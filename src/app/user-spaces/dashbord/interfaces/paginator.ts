export interface Paginator {
  // pageEvent: Function;
  // datasource: any[];
  // pageIndex: number;
  // pageSize: number;
  // length: number;

  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  nextPage: number;
}

export interface PageEvent {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}
