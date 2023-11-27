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
  pressao;
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
      {name: 'Consumo Entrada', code: ' E'},
      {name: 'Consumo Saída', code: ' S'},
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

      case 'Consumo Entrada':
        this.initChartEntrada();
        this.toggleChartTypeEntrada()
        break;

      case 'Consumo Saída':
        this.initChartSaida();
        this.toggleChartTypeSaida()
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
          label: 'Vazão Entrada',
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff',
        }, {
          data: [],
          lineTension: 0,
          label: 'Vazão Saída',
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
          display: true
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
          id: agora.format('MM/DD/YYYY HH:mm:ss'),
          fluxoEntrada: bioData[2],
          vazaoEntrada: bioData[5],
          fluxoSaida: bioData[3],
          vazaoSaida: bioData[6],
          pressao: bioData[4]
        });

        const myChart = this.chart;

        // myChart.data.datasets[0].data.unshift(bioData[0]);//vazaoEntradaTotal
        // myChart.data.datasets[1].data.unshift(bioData[1]);//vazaoSaidaTotal
        // myChart.data.datasets[2].data.unshift(bioData[2]);//fluxoEntradaLigado
        // myChart.data.datasets[3].data.unshift(bioData[3]);//fluxoSaidaLigado
        // // myChart.data.datasets[3].data.unshift(bioData[4]);//pressao
        // myChart.data.datasets[4].data.unshift(bioData[5]);//vazaoEntrada
        // myChart.data.datasets[5].data.unshift(bioData[6]);//vazaoSaida

        myChart.data.datasets[0].data.unshift(bioData[5]);
        myChart.data.datasets[1].data.unshift(bioData[6]);

        // Remova os dados mais antigos se a quantidade ultrapassar 100
        // Atualize o gráfico
        myChart.update();

      }, {
        onlyOnce: true, // Apenas uma vez para evitar múltiplas chamadas
      });
    }
  }

  initChartEntrada() {
    if (this.chart) {
      this.chart.destroy(); // Destrua a instância do gráfico existente
    }

    const ctx = document.getElementById("myChart");

    this.chart = new Chart(ctx, {
      type: 'bar', // Change type to 'bar' for a bar chart
      data: {
        labels: Array.from({length: 11}, (_, i) => `${String(i).padStart(0, '10')} Min`),
        datasets: [{
          label: 'Consumo Total Entrada',
          data: [], // Add your data for the first dataset
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 1
        }, {
          label: 'Entrada Mínima',
          data: [], // Add your data for the second dataset
          backgroundColor: '#fa5151',
          borderColor: '#fa5151',
          borderWidth: 1
        }, {
          label: 'Entrada Máxima',
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

  toggleChartTypeEntrada() {
      let total = 270;
      let minimo = 5;
      let maximo = 75;
      let agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
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


      total = 257;
      minimo =  9;
      maximo =  62;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 289;
      minimo =  2;
      maximo =  92;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 276;
      minimo =  4;
      maximo =  84;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 257;
      minimo =  1;
      maximo =  88;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 264;
      minimo =  7;
      maximo =  89;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 298;
      minimo =  9;
      maximo =  99;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 257;
      minimo =  3;
      maximo =  77;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 257;
      minimo =  5;
      maximo =  92;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 272;
      minimo =  6;
      maximo =  81;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();


      total = 268;
      minimo =  10;
      maximo =  60;
      agora = moment();


      this.tableDataHour.unshift({
        id: agora.format('MM/DD/YYYY HH:mm:ss'),
        total: total,
        minimo: minimo,
        maximo: maximo

      });


      // myChart.data.datasets[0].data.unshift(bioData[0]);
      // myChart.data.datasets[1].data.unshift(bioData[0]);

      myChart.data.datasets[0].data.unshift(total);
      myChart.data.datasets[1].data.unshift(minimo);
      myChart.data.datasets[2].data.unshift(maximo);

      myChart.update();

  }

  initChartSaida() {
    if (this.chart) {
      this.chart.destroy(); // Destrua a instância do gráfico existente
    }

    const ctx = document.getElementById("myChart");

    this.chart = new Chart(ctx, {
      type: 'bar', // Change type to 'bar' for a bar chart
      data: {
        labels: Array.from({length: 11}, (_, i) => `${String(i).padStart(0, '10')} Min`),
        datasets: [{
          label: 'Consumo Total Saída',
          data: [], // Add your data for the first dataset
          backgroundColor: '#ee00ff',
          borderColor: '#ee00ff',
          borderWidth: 1
        }, {
          label: 'Saída Mínima',
          data: [], // Add your data for the second dataset
          backgroundColor: '#fade51',
          borderColor: '#fade51',
          borderWidth: 1
        }, {
          label: 'Saída Máxima',
          data: [], // Add your data for the second dataset
          backgroundColor: '#ea9a61',
          borderColor: '#ea9a61',
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

  toggleChartTypeSaida() {
    let total = 290;
    let minimo = 8;
    let maximo = 65;
    let agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
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


    total = 287;
    minimo =  2;
    maximo =  62;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 269;
    minimo =  8;
    maximo =  62;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 286;
    minimo =  7;
    maximo =  54;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 287;
    minimo =  5;
    maximo =  68;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 284;
    minimo =  9;
    maximo =  69;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 278;
    minimo =  3;
    maximo =  69;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 277;
    minimo =  7;
    maximo =  57;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 287;
    minimo =  9;
    maximo =  52;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 252;
    minimo =  9;
    maximo =  61;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();


    total = 298;
    minimo =  4;
    maximo =  80;
    agora = moment();


    this.tableDataHour.unshift({
      id: agora.format('MM/DD/YYYY HH:mm:ss'),
      total: total,
      minimo: minimo,
      maximo: maximo

    });


    // myChart.data.datasets[0].data.unshift(bioData[0]);
    // myChart.data.datasets[1].data.unshift(bioData[0]);

    myChart.data.datasets[0].data.unshift(total);
    myChart.data.datasets[1].data.unshift(minimo);
    myChart.data.datasets[2].data.unshift(maximo);

    myChart.update();

  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
