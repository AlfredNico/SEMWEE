import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isURL'
})
export class IsURLPipe implements PipeTransform {

  transform(value: any, args?: any[]): any {
    if (value === null) {
      return 'Not assigned';
    }
    const res = value.match(
      /(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res !== null) {
      return true;
    }
    return false;
  }

}
