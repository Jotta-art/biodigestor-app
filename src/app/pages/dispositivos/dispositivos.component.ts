import {Component, OnInit} from '@angular/core';

// core components
import {HomeService} from "../../services/home.service";
import {getDatabase, onValue, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss']
})
export class DispositivosComponent implements OnInit {
  vazaoEntrada: unknown;
  vazaoSaida: unknown;

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
  class: string;
  classSaida: string;
  textEntrada: string;
  textSaida: string;

  constructor(private service: HomeService) {
  }

  ngOnInit(): void {
    setInterval(() => this.fetchDataFromFirebase(), 1000);
  }

  fetchDataFromFirebase() {
    onValue(this.dataRef, (snapshot) => {
      const data = snapshot.val();
      let bioData = Object.values(data);

      if (bioData[5] > this.vazaoEntrada) {
        this.class = 'fa-arrow-up';
        this.textEntrada = 'text-success';
      } else {
        this.class = 'fa-arrow-down'
        this.textEntrada = 'text-danger'
      }

      if (bioData[6] > this.vazaoEntrada) {
        this.classSaida = 'fa-arrow-up'
        this.textSaida = 'text-success'
      } else {
        this.classSaida = 'fa-arrow-down'
        this.textSaida = 'text-danger'
      }

      this.vazaoEntrada = bioData[5];
      this.vazaoSaida = bioData[6];
      // pressao: bioData[4]
    }, {
      onlyOnce: true, // Apenas uma vez para evitar múltiplas chamadas
    });
  }

}
