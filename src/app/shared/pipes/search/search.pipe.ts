import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search' ,
})
export class SearchPipe implements PipeTransform {
  transform(arr:any[] , value:string):any[] {
    return arr.filter((curr) => curr.title.toLowerCase().includes(value.toLowerCase())) ;
  }
}
