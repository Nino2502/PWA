import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';


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

  constructor(private navCtrl: NavController, private ngZone: NgZone) {}

  async ngOnInit(){

    setTimeout(() => {

      this.isModalOpen = false;


    },3000);

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
  validarCampos() {
    //SE VAN A CONVERIR TODAS LAS MAYUSCULAS EN MINUSCULAS EN 
    ///AUTOMATICO
    this.email = this.email.trim().toLowerCase();
    ///vA A GUARDAR TODOS LOS INPUT SIN ESPACIOS
    this.password = this.password.trim().replace(/\s/g, '');
    //isValid si cumple esas condiciones se va a cambiar a true
    this.isValid = this.email !== '' && this.password !== '';
  }
  entrar_inicio(){

    this.validarCampos();
    if(this.isValid){

      this.isloading = true;
      setTimeout(() => {
        this.ngZone.run(() => { 

          this.isloading = false;
          this.navCtrl.navigateForward('/home-2');
          
        });
      }, 5000);

  
    }else{
      alert("No cumple con las condiciones");
      this.isValid = false;
    }
  }
}
