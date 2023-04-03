import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { IAuthData } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor( private dataService: DataService, private router: Router, private http: HttpClient ) {}

  public profileForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  public onSubmit(){
    const data: IAuthData = {
      login: this.profileForm.get('login')!.value as string,
      password: this.profileForm.get('password')!.value as string,
    };
    this.dataService.getAuthToken(data).subscribe(response => {
      this.profileForm.reset();
      localStorage.setItem('authToken', response.auth_token);
      this.router.navigate(['/']);
    });;
  }
}
