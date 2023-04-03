import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../interfaces/interfaces';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(myUsers: IUser[], search: string, searchField: keyof IUser): IUser[] {
    if (!searchField || !search) {
      return myUsers;
    }
    return myUsers.filter(user => {
      const searchValue = search.toLocaleLowerCase();
      const fieldValue = user[searchField]!.toString().toLocaleLowerCase();
      return fieldValue.includes(searchValue);
    });
  }
}
