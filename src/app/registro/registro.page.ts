import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RegistroPage {
  email: string = '';
  fullName: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthdate: string = '';
  isValid: boolean = false;
  
  emailError: string = '';
  isEmailValid: boolean = false;
  passwordsMatch: boolean = false;
  passwordError: string = '';
  isModalOpen = false;

  usuarios: any[] = [];


  constructor() {}

  alerta_nino(isOpen: boolean) {
    this.isModalOpen = isOpen;
    console.log("Tuvo que llegar TRUE,", this.isModalOpen);

    if (isOpen) {
      setTimeout(() => {
        this.isModalOpen = false;
      }, 5000);
    }
  }

  validarCampos() {
    this.username = this.username.trim().toLowerCase();
    this.password = this.password.trim().replace(/\s/g, '');
    this.confirmPassword = this.confirmPassword.trim().replace(/\s/g, '');
    this.fullName = this.fullName.toUpperCase();

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.email);
    this.emailError = !this.isEmailValid ? "Correo electrónico no válido" : "";

    // Validar contraseñas
    this.passwordsMatch = this.password === this.confirmPassword;
    this.passwordError = !this.passwordsMatch ? "Las contraseñas no coinciden" : "";

    // Verificar si el formulario es válido
    this.isValid = this.username !== '' &&
                   this.password !== '' &&
                   this.passwordsMatch &&
                   this.isEmailValid &&
                   this.fullName !== '' &&
                   this.birthdate !== '';

    console.log("Soy validacion . ." + this.isValid);

  }

  entrar_inicio() {
    this.validarCampos();



    if (this.isValid) {

      const nuevo_usuario = {
        email: this.email,
        fullname: this.fullName,
        username: this.username,
        password: this.password,
        birthdate: this.birthdate
      }


      this.usuarios.push(nuevo_usuario);

      console.log("Somos Los Usuarios");

      console.log("Todos los usuarios registrados . .", this.usuarios);

      this.email = "";
      this.fullName = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.birthdate = '';
      this.isValid = false;


      


   
    } else {

      alert("No cumples con la validacion");

    }
  }
}
