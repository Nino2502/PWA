import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FirestoreService } from '../services/firestore.service';

import { getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";

import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  email: string = '';
  password: string = '';
  isValid: boolean = false;
  isModalOpen = true;

  isloading = false;
//Author : Jesus Gonzalez Leal IDGS08 (Nino :3)
//DATE: 15/02/2025

  constructor(private navCtrl: NavController, private ngZone: NgZone,private firestoreService: FirestoreService) {}
  async ngOnInit(){
    setTimeout(() => {
      this.isModalOpen = false;
    },3000);
  }
  async entrar_inicio() {
    this.validarCampos();
    if (!this.isValid) {
      alert("No cumple con las condiciones");
      return;
    }
    //Author: Jesus Gonzalez Leal IDGS08
    this.isloading = true;
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      
      if (user) {
        const userDoc = await this.firestoreService.getDocument('users', user.uid);
        if (userDoc) {
          console.log('Datos del usuario:', userDoc);
          
          const storedHashedPassword = userDoc['password'];
          const passwordMatch = await bcrypt.compare(this.password, storedHashedPassword);
          
          if (passwordMatch) {
            this.ngZone.run(() => {
              this.isloading = false;
              this.navCtrl.navigateForward('/home-2');
            });
          } else {
            alert('Contraseña incorrecta');
          }
        } else {
          alert('No se encontraron datos del usuario en Firestore');
        }
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error al iniciar sesión: ');
    } finally {
      this.isloading = false;
    }
  }


  validarCampos() {
    //SE VAN A CONVERIR TODAS LAS MAYUSCULAS EN MINUSCULAS EN 
    ///AUTOMATICO
    this.email = this.email.trim().toLowerCase();
    ///vA A GUARDAR TODOS LOS INPUT SIN ESPACIOS
    this.password = this.password.trim().replace(/\s/g, '');
    //isValid si cumple esas condiciones se va a cambiar a true
    this.isValid = this.email !== '' && this.password !== '';
  }

  
  alerta_nino(isOpen: boolean){

    this.isModalOpen = isOpen;
    console.log("Tuvo que llegar TRUE,", this.isModalOpen)

    if(isOpen){
      setTimeout(()=> {
        this.isModalOpen = false;

      }, 5000);
    }
  }
}
