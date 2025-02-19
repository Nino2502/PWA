import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  user: any;


  usuarios: any[] = [];

  rolUsuario : string = '';



  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.firestoreService.getCollection<any>('users').subscribe(data => {
      this.usuarios = data;
      console.log('Soy los usuarios en la base de datos . . .:', this.usuarios);
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


  }



}
