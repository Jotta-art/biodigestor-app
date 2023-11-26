import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Filtro} from "../models/filtro";
import {Dado} from "../models/dado";
import * as dotenv from 'dotenv';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {
  }

  getDados(): Observable<Dado[]> {
    return this.http.get<Dado[]>(process.env.BASE_URL + '/home')
  }

  novo(filtro: Filtro) {
    return this.http.post<Dado>(process.env.BASE_URL + '/home', filtro)
  }

  deletar(id: string) {
    return this.http.delete<Dado>(process.env.BASE_URL + `/home/${id}`)
  }

  editar(dado: Dado) {
    return this.http.put<Dado>(process.env.BASE_URL + `/home/${dado.id}`, dado)
  }
}
