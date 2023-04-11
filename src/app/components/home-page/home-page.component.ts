import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit  {

  constructor(private router: Router, private dataService: DataService) {}

  public allUsers: IUser[] = [];
  public mainToken = localStorage.getItem('mainToken') ?? undefined;
  public sortOrder: string = "asc";
  public sortDirection: 'asc' | 'desc' | undefined;
  public sortField: keyof IUser | undefined;
  public search = '';
  public searchField: keyof IUser= 'last_name';

  public ngOnInit(): void {
    if (!this.mainToken) {
      this.dataService.getMainToken().subscribe((token) => {
        localStorage.setItem('mainToken', token);
      });
    }
    this.getUsers(this.mainToken);
  }

  public getUsers(maintoken: string | undefined, limit?: number, search?: string,  offset?: number): void {
    this.dataService.getAllPasses( maintoken, limit, search,  offset).subscribe(value => {
      const passes = value.passes;
      this.allUsers = passes.map((pass: IUser)=> ({
        first_name: pass.first_name,
        last_name: pass.last_name,
        pat_name: pass.pat_name,
        email: pass.email,
        birthday: pass.birthday,
        phone: pass.phone,
        user_id: pass.user_id,
        summ: pass.summ,
        discount: pass.discount,
        bonus: pass.bonus,
      }))
    });
  }
  public pushMessage(user_id: number, message: string): void {
    const user = this.allUsers.find(u => u.user_id === user_id);
    if (user) {
      user.messageForUser = '';
    }
    this.dataService.pushUserMessage(user_id, message, this.mainToken).subscribe();
  }

  public sort(property: keyof IUser): void {
    if (this.sortField === property) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = property;
      this.sortDirection = 'asc';
    }
    this.allUsers = [...this.allUsers].sort((a, b) => {
      const sortDirection = this.sortDirection === 'asc' ? 1 : -1;

      let valueA = a[property]!;
      let valueB = b[property]!;



      if(typeof(valueA) === 'string' && ['discount', 'summ', 'bonus', 'phone'].includes(property)) {
        valueA = parseInt(valueA);
      }
      if(typeof(valueB) === 'string' && ['discount', 'summ', 'bonus', 'phone'].includes(property)) {
        valueB = parseInt(valueB);
      }

      if (typeof(valueA) === 'string' && property === 'birthday') {
        valueA = new Date(valueA.split('.').reverse().join('-')).getTime();
      }

      if (typeof(valueB) === 'string' && property === 'birthday') {
        valueB = new Date(valueB.split('.').reverse().join('-')).getTime();
      }


      if (valueA < valueB) {
        return -1 * sortDirection;
      }
      if (valueA > valueB) {
        return 1 * sortDirection;
      }
      return 0;
    });
  }

  public exit(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
