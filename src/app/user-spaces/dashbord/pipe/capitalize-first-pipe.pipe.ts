import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstPipe',
})
export class CapitalizeFirstPipePipe implements PipeTransform {
  transform(value: string, args?: any[]): string {
    if (value === null) {
      return 'Not assigned';
    }
    const re = /(\b[a-z](?!\s))/g;
    return value !== 'ID' ? value.replace(re, (x) => x.toUpperCase()) : value;
  }
}

// return value !== 'ID' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
//   : value;
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'titleCaseExcept' })
// export class TitleCaseExceptPipe implements PipeTransform {
//   transform(value: string): string {
//     if (!value) return value; // safeguard

//     // regex to find all words EXCEPT the ones we don't want capitalized
//     let words: RegExp = /\b(?!of|by|the)\w+/g;
//     // capitalize the first letters of said words
//     let newVal = value.replace(words, (match) => {
//       return match.replace(
//         /^\w/,
//         (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
//       );
//     });

//     // always capitalize the first character of newVal
//     return newVal.charAt(0).toUpperCase() + newVal.substr(1);
//   }
// }
