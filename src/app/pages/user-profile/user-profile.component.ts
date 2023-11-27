import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth.service";
import {HomeService} from "../../services/home.service";
import {MessageService} from "primeng/api";
import {Usuario} from "../../models/usuario";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit {
  usuarioLogado: string;
  email: string;
  nome = 'Seu Nome';
  imageSrc: string | undefined;

  @ViewChild('fileInput') fileInput!: ElementRef;
  usuario: Usuario;
  mostrar = false;


  constructor(private authService: AuthService, private service: HomeService) {
  }
  ngOnInit() {
    this.usuarioLogado = this.authService.getUsuarioAutenticado();
    this.service.obterDadosUsuarioLogado(this.usuarioLogado)
      .subscribe({
        next: response => {
          console.log(response);
          if (response) {
            this.usuario = response;
            this.email = response.email;
            this.imageSrc = response.imagem;
          }
        }, error: (error) => {
        }
      });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onUpload(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Set image src
      this.imageSrc = e.target.result;
      this.salvarImagem();
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  salvarImagem() {
    if (this.imageSrc) {
      let usuario = new Usuario();
      usuario.username = this.usuarioLogado;
      usuario.imagem = this.imageSrc;
      usuario.email = this.email;
      usuario.password = this.usuario.password;
      this.service.salvarFotoPerfil(usuario)
        .subscribe({
          next: response => {
            this.service.atualizaImagem.next(usuario.imagem);
          }, error: (error) => {
          }
        });
    }
  }
}
