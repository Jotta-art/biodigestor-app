import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {HomeService} from "../../services/home.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  usuarioLogado: string;
  email: string;


  constructor(private authService: AuthService, private service: HomeService) {
  }

  ngOnInit() {
    this.usuarioLogado = this.authService.getUsuarioAutenticado();
    this.service.obterEmailUsuarioLogado(this.usuarioLogado)
      .subscribe({
        next: response => {
          console.log("RESPONMSE" +  response);
          if (response) this.email = response.email;
        }, error: (error) => {
          console.log(error);
        }
      });
  }
}
