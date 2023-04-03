import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAuthData } from '../interfaces/interfaces'
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class DataService {

  constructor(private http: HttpClient ) { }

  public getAuthToken(data: IAuthData): Observable<any> {
    const apiUrl = 'https://api.asgk-group.ru/test-auth-only';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  public getMainToken(): Observable<any> {
    const url = 'https://api.asgk-group.ru/v1/authorization';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authToken')!,

      })
    };
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => response.tokens[1].token));
  }

  public getAllPasses( mainToken: string | undefined, limit: number = 1000, search: string = '',  offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .append('limit', limit.toString())
      .append('offset', offset.toString());
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')!,
        }),
        params,
      }
    const url = 'https://api.asgk-group.ru/v1'
    return this.http.get(`${url}/${mainToken}/passes`,  httpOptions );
  }

  public pushUserMessage(user_id: number, message:string, mainToken: string | undefined): Observable<any> {
    const url = `https://api.asgk-group.ru/v1/${mainToken}/message/push`;
    const body = {
      user_id: user_id.toString(),
      date_start: '',
      push_message: message,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authToken')!,
      })
    };
    return this.http.post(url, body, httpOptions);
  }
}

