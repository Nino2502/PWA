import { Component, OnInit } from '@angular/core';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
  standalone: false

})
export class CamaraPage implements OnInit {

  capturedImage: string | undefined;
  selectedFilter: string = 'none';



  constructor() { }

  ngOnInit() {
  }

  async takePicture() {
    try {
    const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
    });
    this.capturedImage = `data:image/jpeg;base64,${image.base64String}`;

    } catch (error) {
    console.error('Error al capturar imagen:', error);
    }
    }

}
