import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Filtro} from "../models/filtro";
import {Dado} from "../models/dado";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {
  }

  getDados(): Observable<Dado[]> {
    return this.http.get<Dado[]>(environment.baseUrl + '/home')
  }

  novo(filtro: Filtro) {
    return this.http.post<Dado>(environment.baseUrl + '/home', filtro)
  }

  deletar(id: string) {
    return this.http.delete<Dado>(environment.baseUrl + `/home/${id}`)
  }

  editar(dado: Dado) {
    return this.http.put<Dado>(environment.baseUrl + `/home/${dado.id}`, dado)
  }
}
