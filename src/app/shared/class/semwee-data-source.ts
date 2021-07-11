import { DataSource } from '@angular/cdk/collections';
import { Subject, BehaviorSubject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../models/api';
import { FormGroup, FormControl } from '@angular/forms';

export class SemweeDataSource<T> implements DataSource<T> {
  private allData: PaginatedResponse<T> = {
    length: 0,
    data: [],
    pageIndex: '1',
  };

  private pagination: MatPaginator;

  private visibleData = new BehaviorSubject<T[]>([]);

  public options: BehaviorSubject<IRequestOptions>;

  private unsubscribe = new Subject<any>();

  constructor() {
    const defaultValues: IRequestOptions = {
      sort: {
        active: '',
        direction: '',
      },
      paginator: {
        length: this.allData.length,
        pageIndex: 0,
        pageSize: 0,
      },
      filters: {},
    };
    this.options = new BehaviorSubject(defaultValues);
  }

  /**
   * additionnal query parameters we'd like to add to the sort and pagination
   * for example the `search` field
   */
  set filter(control: FormGroup | FormControl) {
    if (control instanceof FormGroup) {
      control.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((values) =>
          this.options.next({
            ...this.options.getValue(),
            filters: values,
          })
        );
    } else if (control instanceof FormControl) {
      control.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((value) =>
          this.options.next({
            ...this.options.getValue(),
            filters: { filter: value },
          })
        );
    } else {
      throw new Error('filter must be of type FormGroup or FormControl');
    }
  }
  /**
   * the sort component associated with the table.
   * read the documentation of `matSort` for specifications
   *
   * the sort is optional but recommended
   *
   * for convenience with the web service, fields like *Nom et prénom*
   * must be defined as `name-firstname` (not `nameFirstname` anymore)
   * because `name` and `firstname` are the name of fields in the database.
   *
   * If any problem with those field names, ask the back-end team
   */
  set sort(matSort: MatSort) {
    if (matSort instanceof MatSort) {
      matSort.sortChange.asObservable().subscribe((sort) => {
        this.options.next({ ...this.options.getValue(), sort });
      });
    } else {
      throw new Error(`sort must be of type MatSort`);
    }
  }
  set paginator(matPaginator: MatPaginator) {
    if (matPaginator instanceof MatPaginator) {
      this.options.next({
        ...this.options.getValue(),
        paginator: {
          ...this.options.getValue().paginator,
          pageSize: matPaginator.pageSize,
        },
      });

      this.pagination = matPaginator;

      matPaginator.page.asObservable().subscribe((paginator) => {
        this.options.next({ ...this.options.getValue(), paginator });
      });
    } else {
      throw new Error(`paginator must be of type MatPaginator`);
    }
  }

  set data(values: PaginatedResponse<T>) {
    this.allData = values;
    this.visibleData.next(values.data);

    if (this.pagination) {
      this.pagination.length = values.length;
      this.pagination.pageIndex = Number(values.pageIndex);
    }
  }

  get data() {
    return this.allData;
  }

  get queryParams() {
    return this.options.pipe(
      map(({ sort, paginator, filters }) => {
        let params = new HttpParams()
          .append('sortBy', sort.active)
          .append('sortOrder', sort.direction)

          .append('pageIndex', paginator.pageIndex.toString())
          .append('pageSize', paginator.pageSize.toString());

        Object.keys(filters).forEach((key) => {
          params = params.set(key, filters[key]);
        });

        return params;
      })
    );
  }

  connect() {
    return this.visibleData;
  }
  disconnect() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

export interface IRequestOptions {
  sort?: Sort;
  paginator?: PageEvent;
  filters?: { [key: string]: string };
}
