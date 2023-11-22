import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Filtro} from "../models/filtro";
import {Dado} from "../models/dado";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {
  }

  getDados(): Observable<Dado[]> {
    return this.http.get<Dado[]>('http://localhost:8080/home')
  }

  novo(filtro: Filtro) {
    return this.http.post<Dado>('http://localhost:8080/home', filtro)
  }

  deletar(id: string) {
    return this.http.delete<Dado>(`http://localhost:8080/home/${id}`)
  }

  editar(filtro: Filtro) {
    return this.http.put<Dado>(`http://localhost:8080/home/${filtro.dadoEditar.id}`, filtro)
  }
}
