import {AfterViewInit, Component, OnInit} from '@angular/core';

import {Chart} from 'chart.js';
import {replace as featherReplace} from 'feather-icons';
import {getDatabase, onValue, ref} from 'firebase/database';
import * as moment from 'moment';
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";


// core components

class TableDataHour {
  id;
  total;
  minimo;
  maximo;
}

class TableData {
  id;
  fluxoEntrada;
  vazaoEntrada;
  fluxoSaida;
  vazaoSaida;
}

interface Grafico {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dispositivos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit {
  tableData: TableData[] = [];
  tableDataHour: TableDataHour[] = [];
  chart: Chart;

  firebaseConfig = {
    apiKey: "AIzaSyD564v-piEtUcSlFB1ZOw_GePDfsHDLDvw",
    authDomain: "biodigestorifsp.firebaseapp.com",
    databaseURL: "https://biodigestorifsp-default-rtdb.firebaseio.com",
    projectId: "biodigestorifsp",
    storageBucket: "biodigestorifsp.appspot.com",
    messagingSenderId: "635344515653",
    appId: "1:635344515653:web:4962c620a1045d698ce92c",
    measurementId: "G-YN7V5XP9ZV"
  };

  app = initializeApp(this.firebaseConfig);
  analytics = getAnalytics(this.app);
  database = getDatabase(this.app);
  dataRef = ref(this.database, '/');
  graficos: Grafico[];
  selectedGrafico: Grafico;

  ngOnInit() {

    this.app = initializeApp(this.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.database = getDatabase(this.app);
    this.dataRef = ref(this.database, '/');


    this.graficos = [
      {name: 'Real-Time', code: 'R'},
      {name: 'Hour', code: ' H'},
    ];

    this.selectedGrafico = {name: 'Real-Time', code: 'R'};

    featherReplace();

    this.initChartRealtime();

    setInterval(() => this.fetchDataFromFirebase(), 1000);
  }

  alterarCampos() {
    switch (this.selectedGrafico.name) {
      case 'Real-Time':
        this.initChartRealtime();
        this.fetchDataFromFirebase();
        break;

      case 'Hour':
        this.initChartHour();
        this.toggleChartType()
        break;
    }
  }

  initChartRealtime() {
    if (this.chart) {
      this.chart.destroy(); // Destrua a instância do gráfico existente
    }

    const ctx = document.getElementById("myChart");

    this.chart = this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 11}, (_, i) => `${String(i).padStart(1, '0')}s`),
        datasets: [{
          data: [],
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff',
        }, {
          data: [],
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#fa5151',
          borderWidth: 4,
          pointBackgroundColor: '#fa5151',
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

  fetchDataFromFirebase() {
    if (this.selectedGrafico.name === 'Real-Time') {
      onValue(this.dataRef, (snapshot) => {
        const data = snapshot.val();
        const agora = moment();
        //CONTEUDO DA FIRE BASE
        let bioData = Object.values(data);
        let numeroAleatorio = Math.random() * 20;
        let numeroAleatorio2 = Math.random() * 20;

        if (this.tableData === undefined) this.tableData = [];

        this.tableData.unshift({
          id: agora.format('YYYY-MM-DD HH:mm:ss'),
          fluxoEntrada: 'True',
          vazaoEntrada: numeroAleatorio,
          fluxoSaida: 'False',
          vazaoSaida: numeroAleatorio2
        });

        const myChart = this.chart;


        // myChart.data.datasets[0].data.unshift(bioData[0]);
        console.log(Object.values(myChart.data.datasets[0].data))
        // myChart.data.datasets[1].data.unshift(bioData[0]);

        myChart.data.datasets[0].data.unshift(numeroAleatorio);
        myChart.data.datasets[1].data.unshift(numeroAleatorio2);

        // Remova os dados mais antigos se a quantidade ultrapassar 100
        // Atualize o gráfico
        myChart.update();

      }, {
        onlyOnce: true, // Apenas uma vez para evitar múltiplas chamadas
      });
    }
  }

  initChartHour() {
    if (this.chart) {
      this.chart.destroy(); // Destrua a instância do gráfico existente
    }

    const ctx = document.getElementById("myChart");

    this.chart = new Chart(ctx, {
      type: 'bar', // Change type to 'bar' for a bar chart
      data: {
        labels: Array.from({length: 7}, (_, i) => `${String(i).padStart(0, '1')} Hora`),
        datasets: [{
          label: 'Total',
          data: [], // Add your data for the first dataset
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 1
        }, {
          label: 'Mínimo',
          data: [], // Add your data for the second dataset
          backgroundColor: '#fa5151',
          borderColor: '#fa5151',
          borderWidth: 1
        }, {
          label: 'Máximo',
          data: [], // Add your data for the second dataset
          backgroundColor: '#87ea61',
          borderColor: '#87ea61',
          borderWidth: 1
        }

        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: true, // Set display to true if you want to show the legend
        }
      }
    });
  }

  toggleChartType() {
    for (let i = 0; i < 7; i++) {
      let total = this.getRandomNumber(250, 500);
      let minimo = this.getRandomNumber(1, 10);
      let maximo = this.getRandomNumber(50, 100);
      const agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('YYYY-MM-DD HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });

      const myChart = this.chart;


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();

    }
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
