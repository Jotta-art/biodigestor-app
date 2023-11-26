import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Usuario} from "./models/usuario";
import {Observable} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenURL = 'http://localhost:8080/oauth/token';
  clientId = 'my-angular-app';
  clientSecret = '@321';

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  obterToken() {
    const tokenString = localStorage.getItem('access_token');
    if (tokenString) {
      return JSON.parse(tokenString).access_token;
    }

    return null;
  }

  encerrarSessao() {
    localStorage.removeItem('access_token')
  }

  getUsuarioAutenticado() {
    const token = this.obterToken();
    if (token) {
      return this.jwtHelper.decodeToken(token).user_name;
    }

    return null;
  }

  isAutheticated(): boolean {
    const token = this.obterToken();
    if (token) {
      const expirated = this.jwtHelper.isTokenExpired(token);
      return !expirated;
    }

    return false;
  }

  salvar(usuario: Usuario): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/usuarios", usuario);

  }

  tentarLogar(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set("username", username)
      .set("password", password)
      .set("grant_type", "password");

    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    console.log(headers);

    return this.http.post(this.tokenURL, params.toString(), {headers});
  }

}
