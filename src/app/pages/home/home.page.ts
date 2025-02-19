import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

import { ToastController } from '@ionic/angular';

import { AlertController,  AlertInput } from '@ionic/angular';





import * as bcrypt from 'bcryptjs';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  user: any;

  roles: any[] = [];


  data: any[] = [];




  usuarios: any[] = [];

  rolUsuario : string = '';



  constructor(private firestoreService: FirestoreService, private alertController: AlertController, private toastController: ToastController, private auth: Auth) { }

  ngOnInit() {
    this.firestoreService.getCollection<any>('users').subscribe(data => {
      this.usuarios = data;
      console.log('Soy los usuarios en la base de datos . . .:', this.usuarios);
    });

    this.firestoreService.getCollection<any>('roles').subscribe(data => {
      this.roles = data;
      console.log('Datos ROLES . . .:', this.roles);
    });


    const tokenString = localStorage.getItem('token');

    if(tokenString){

      const token = JSON.parse(tokenString);
      this.user = {
        uid: token.uid,
        role: token.role,
        permissions: token.permissions
      };
      console.log('Usuario en home-2:', this.user);

      console.log("Soy rol de usuario. .", this.user['role']);

      this.rolUsuario = this.user['role'];

    }else{
      console.log("No hay datos en localStorge");
    
    }
  }


  editarEmpleado(users : any){
    console.log("Soy editrar empleo. .", users);
  }

  eliminarEmpleado(id : string){

    console.log("Soy editar nuevo usuario . . ", id);

    this.firestoreService.deleteDocument('users', id)
      .then(() => this.mostrarToast("Usuario eliminado correctamente", "success"))
      .catch(error => console.error("Error al eliminar usuario:", error));


  }
  async agregarEmpleado() {
    if (!this.roles || this.roles.length === 0) {
      this.mostrarToast("Cargando roles, intenta de nuevo", "warning");
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Agregar nuevo empleado',
      inputs: [
        { name: 'fullName', type: 'text', placeholder: 'Nombre Completo', value: '' },
        { name: 'username', type: 'text', placeholder: 'Username', value: '' },
        { name: 'email', type: 'email', placeholder: 'Correo Electrónico', value: '' },
        { name: 'password', type: 'password', placeholder: 'Contraseña', value: '' },
        { name: 'confirmPassword', type: 'password', placeholder: 'Confirmar Contraseña', value: '' },
        { name: 'birthdate', type: 'date', placeholder: 'Fecha de Nacimiento', value: '' },
        // Agregar los roles como opciones de radio
        ...this.roles.map((rol): AlertInput => ({
          name: 'selectRole',
          type: 'radio', // TypeScript ahora reconoce este valor
          label: rol.role,
          value: rol.role,
        })),
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.selectRole) {
              this.mostrarToast("Debe seleccionar un rol", "warning");
              return false;
            }
  
            try {
              const hashedPassword = await bcrypt.hash(data.password, 10);
              const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
              const userId = userCredential.user.uid;
  
              const newData = {
                id: userId,
                fullname: data.fullName.toUpperCase(),
                username: data.username.trim().toLowerCase(),
                email: data.email,
                password: hashedPassword,
                last_login: new Date(),
                role: data.selectRole,
              };

              console.log("Soi los datos de los USUARIOS. .  .", newData);

        
  
              await this.firestoreService.addDocument('users', newData);
              this.usuarios.push(newData);
              this.mostrarToast("Empleado agregado exitosamente", "success");
  
              return true;
            } catch (error) {
              console.error("Error al registrar usuario:", error);
              this.mostrarToast("Error al registrar usuario", "danger");
              return false;
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  
  


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
