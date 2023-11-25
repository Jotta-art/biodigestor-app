import {Component, OnInit} from '@angular/core';

// core components
import {Dado} from "../../models/dado";
import {Filtro} from "../../models/filtro";
import {HomeService} from "../../services/home.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dados: Dado[] = [];
  visible = false;
  filtro: Filtro = new Filtro();
  visibleEditar = false;

  constructor(private homeService: HomeService) {
  }

  buscarDados() {
    this.homeService.getDados()
      .subscribe({
        next: response => {
          if (response) {
            this.dados = response;
          }
        }, error: (error) => {
          console.log(error)
        },
      });
  }

  limpar() {
    this.dados = [];
  }

  novo() {
    this.visible = true;
  }

  enviarNovo() {
    this.homeService.novo(this.filtro)
      .subscribe({
        next: response => {
          this.buscarDados();
          this.visible = false;
        }, error: (error) => {
          console.log(error)
        },
      });
  }

  deletar(id: string) {
    this.homeService.deletar(id)
      .subscribe({
        next: response => {
          this.buscarDados();
        }, error: (error) => {
          console.log(error)
        },
      });
  }

  editar(dado: Dado) {
    this.visibleEditar = true;
    this.filtro.dadoEditar = dado;
  }

  enviarEditado() {
    this.filtro.nome = this.filtro.dadoEditar.chave;
    this.homeService.editar(this.filtro)
      .subscribe({
        next: response => {
          this.buscarDados();
          this.visibleEditar = false;
        }, error: (error) => {
          console.log(error)
        },
      });
  }

  limparFiltro() {
    this.filtro = new Filtro();
  }

  ngOnInit(): void {
  }
}
