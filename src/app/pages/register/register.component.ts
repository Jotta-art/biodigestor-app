import {Component, OnInit} from '@angular/core';
import {Usuario} from "../../models/usuario";
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username = ''
  password = ''
  mensagemSucesso = '';
  errors: String[];

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
  }

  cadastrar() {
    const usuario: Usuario = new Usuario();
    usuario.username = this.username;
    usuario.password = this.password;
    this.authService.salvar(usuario)
      .subscribe(
        response => {
          this.mensagemSucesso = 'Cadastro realizado com sucesso! Efetue o login.';
          this.errors = [];
        }, errorResponse => {
          console.log(errorResponse)
          this.errors = errorResponse.error.errors;
          this.mensagemSucesso = null;
        })
  }
}
