import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RegistroPage {

  //Declaramo cada input 
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

  //Declaro el array para guardar los usuarios
  usuarios: any[] = [];
  //Para poder mostrar la alera Toastr
  constructor(private toastController: ToastController) {}

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
      //Creo una variable tipo form donde voy a guardar todos los inputs
      const nuevo_usuario = {
        email: this.email,
        fullname: this.fullName,
        username: this.username,
        password: this.password,
        birthdate: this.birthdate
      }
      //Agregamos un push en array usuarios
      this.usuarios.push(nuevo_usuario);
      console.log("Somos Los Usuarios");

      console.log("Todos los usuarios registrados . .", this.usuarios);
      //Mostramos la alerta
      this.mostrarToast('Usuario registrado exitosamente!', 'success');
      ///Todos los input lo ponemos vacios
      this.email = "";
      this.fullName = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.birthdate = '';
      this.isValid = false;
    } else {
      this.mostrarToast("No cumple con la validacion",'warning');
    }
  }
  ///Funcion para mostrar la alerta Toastr
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje, 
      duration: 2000,    
      position: 'top',    // Posición del toast ('top', 'bottom', 'middle')
      color: color,       // Color del toast ('success', 'danger', 'warning', 'primary', etc.)
      animated: true, 
    });
    toast.present();
  }  
}
