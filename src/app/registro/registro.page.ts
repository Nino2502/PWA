import { Component, OnInit } from '@angular/core';
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
export class RegistroPage{
  email: string = '';
  password: string = '';
  isValid: boolean = false;
  isModalOpen = false;
  constructor() {}

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
      ///Aqui mando un true a la funcion para mostrar la modal
      this.alerta_nino(true);
    }else{
      alert("No cumple con las condiciones");
      this.isValid = false;
    }
  }


}
