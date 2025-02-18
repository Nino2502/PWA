import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { ToastController } from '@ionic/angular';

import { FirestoreService } from '../services/firestore.service';

import * as bcrypt from 'bcryptjs';




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

  selectRole: any = null;



  
  emailError: string = '';
  isEmailValid: boolean = false;
  passwordsMatch: boolean = false;
  passwordError: string = '';
  isModalOpen = false;

  roles: any [] = [];


  //Declaro el array para guardar los usuarios
  usuarios: any[] = [];
  //Para poder mostrar la alera Toastr
  constructor(private toastController: ToastController, private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.firestoreService.getCollection<any>('roles').subscribe(data => {
      this.roles = data;
      console.log('Datos ROLES . . .:', this.roles);
    });
  }

  onRoleChange(event: any) {
    this.selectRole = event.detail.value; // Ahora será solo el nombre del rol
    console.log("Rol seleccionado:", this.selectRole);
    this.validarCampos();

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
                   this.birthdate !== '' &&
                   this.selectRole !== null;

    console.log("Soy validacion . ." + this.isValid);
    console.log("Soy el select de rol. . ", this.selectRole);
    
  
  }

 async entrar_inicio() {
    this.validarCampos();
    if (this.isValid) {
      try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        const encryptedRole = btoa(this.selectRole);
        //Author : Jesus Gonzalez Leal IDGS08

        const nuevo_usuario = {
          email: this.email,
          fullname: this.fullName,
          username: this.username,
          password: hashedPassword, 
          last_login: new Date(),
          role: encryptedRole
        };
        
        // Agregar usuario al array
        this.usuarios.push(nuevo_usuario);
        console.log("Usuarios Registrados:", this.usuarios);


        this.firestoreService.addDocument('users',nuevo_usuario);

  
        // Mostrar mensaje de éxito
        this.mostrarToast('Usuario registrado exitosamente en la base de datos!', 'success');
  
        // Resetear los campos
        this.email = "";
        this.fullName = '';
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.birthdate = '';
        this.selectRole = null;
        this.isValid = false;
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        this.mostrarToast("Error al registrar usuario", "danger");
      }
    } else {
      this.mostrarToast("No cumple con la validación", 'warning');
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
