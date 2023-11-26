import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = ''
  password = ''
  errors: String[];

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  logar() {
    this.authService.tentarLogar(this.username, this.password)
      .subscribe(response => {
        const acsess_token = JSON.stringify(response);
        localStorage.setItem('access_token', acsess_token);
        this.router.navigate(['/home'])
      }, error =>  {
        this.errors = ['usuário0 e/ou senha incorretos(s).'];
      })
  }

}
