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
  constructor(private service: HomeService) {
  }

  ngOnInit(): void {
  }

}
