export interface Paginator {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  nextPage: number;
  pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
}

export interface PageEvent {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}
