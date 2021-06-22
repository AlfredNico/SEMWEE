import { PageEvent } from '@angular/material/paginator';

export interface Paginator {
  pageEvent: Function;
  datasource: any[];
  pageIndex: number;
  pageSize: number;
  length: number;
}
