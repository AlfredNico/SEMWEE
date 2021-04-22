import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstPipe',
})
export class CapitalizeFirstPipePipe implements PipeTransform {
  transform(value: string, args?: any[]): string {
    if (value === null) {
      return 'Not assigned';
    }
    return value !== 'ID'
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : value;
    // return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }
}
