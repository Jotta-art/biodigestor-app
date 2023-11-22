import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import {Dado} from "../../models/dado";
import {Filtro} from "../../models/filtro";
import {HomeService} from "../../services/home.service";

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss']
})
export class DispositivosComponent implements OnInit {
  visible = false;
  dados: Dado[] = [];
  filtro: Filtro = new Filtro();
  visibleEditar = false;


  constructor(private service: HomeService) {
  }

  ngOnInit(): void {
  }

  buscarDados() {
    this.service.getDados()
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
    this.service.novo(this.filtro)
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
    this.service.deletar(id)
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
    this.service.editar(this.filtro)
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
}
