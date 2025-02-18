import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {


  items: any[] = [];


  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.firestoreService.getCollection<any>('roles').subscribe(data => {
      this.items = data;
      console.log('Datos ROLES . . .:', this.items);
    });
  }

}
