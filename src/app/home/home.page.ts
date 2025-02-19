import { Component, inject, NgZone } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { FirestoreService } from '../services/firestore.service';

import { Auth, getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";





import {  collectionData, addDoc, getDocs, query, where, DocumentData} from '@angular/fire/firestore';

import * as bcrypt from 'bcryptjs';
import { Firestore } from '@angular/fire/firestore';
import { collection, QuerySnapshot } from 'firebase/firestore';

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


  private firestore = inject(Firestore);

  private auth = inject(Auth);


//Author : Jesus Gonzalez Leal IDGS08 (Nino :3)
//DATE: 15/02/2025

  constructor(private navCtrl: NavController, private ngZone: NgZone,private firestoreService: FirestoreService, private toastController: ToastController) {}
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

  

      console.log("Soy CORREO . . ", this.email);

      console.log("Soy PASSWORD . .", this.password);



      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);


      const userId = userCredential.user.uid;

      console.log("Soy el userId..", userId);


      const usersCollection = collection(this.firestore,'users');
      const id_validacion = query(usersCollection, where('id', '==',userId ));

      const consulta = await getDocs(id_validacion);


      if(!consulta.empty){

        const userData: DocumentData = consulta.docs[0].data();

        const userRole = userData['role'];

        const userPermisos = await this.getPermissions(userRole);


        const token = JSON.stringify({
          uid: userId,
          role: userRole,
          permissions: userPermisos,
        });

        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));

        this.mostrarToast('Inicio de sesion exitoso', 'success');
    
        if(userRole === 'admin'){

          this.isloading = true;

          setTimeout(() => {
            this.ngZone.run(() => { 
              this.isloading = false;
              this.navCtrl.navigateForward('/home-2');
              
            });
          }, 5000);


        }else{



          this.isloading = true;
          setTimeout(() => {
            this.ngZone.run(() => { 
              this.isloading = false;
              this.navCtrl.navigateForward('/home-2');
              
            });
          }, 5000);


        }


      }else{


        this.mostrarToast('Usuario no encontrado en la base de datos', 'warning');
      }



 
    } catch (error) {
      console.error('Error en el login:', error);

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

  async getPermissions(role: string): Promise<string[]> {
    const rolesCollection = collection(this.firestore, 'roles');
    const q = query(rolesCollection, where('role', '==', role));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const roleData = querySnapshot.docs[0].data();
      return roleData['permissions'] || [];
    }
    return [];
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
