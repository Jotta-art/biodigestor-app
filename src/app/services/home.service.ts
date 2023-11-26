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
    return this.http.get<Dado[]>('https://tcc-api-v1-fa6828c60737.herokuapp.com/home')
  }

  novo(filtro: Filtro) {
    return this.http.post<Dado>('https://tcc-api-v1-fa6828c60737.herokuapp.com/home', filtro)
  }

  deletar(id: string) {
    return this.http.delete<Dado>(`https://tcc-api-v1-fa6828c60737.herokuapp.com/home/${id}`)
  }

  editar(dado: Dado) {
    return this.http.put<Dado>(`https://tcc-api-v1-fa6828c60737.herokuapp.com/home/${dado.id}`, dado)
  }
}
