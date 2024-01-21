// mesas.component.ts
import { Component, Injectable } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  DocumentData,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../DB Fire Base/conexion-FireBase';
import { PlatillosService } from './platillos.service/platillos.service';
import { Platillo } from './models/Platillo';
import { from, interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-platillos',
  templateUrl: './platillos.component.html',
  styleUrls: ['./platillos.component.css']
})
export class PlatillosComponent {
  platillos: any[] = [];
  messages: Message[] = [];
  public esEdicion: boolean = false;
  ids: string[] = [];
  public mesaEditar: [] = []
  public idPlatilloEditar: any;
  public platillo: Platillo = new Platillo();
  public visible: boolean = false;

  platilloForm!: FormGroup;

  constructor(private platillosService: PlatillosService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerPlatillos();

    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required],
      carreta: ['', Validators.required]
      // Agrega carreta e imagen según tus necesidades
    });
  }

  async obtenerPlatillos() {
    // const intervalTime = 5000;

    // // Realiza la petición a la API cada 5 segundos
    // interval(intervalTime).pipe(
    //   switchMap(() => 
    //     from(this.platillosService.obtenerPlatillos()).pipe(
    //       catchError(error => {
    //         console.error('Error al obtener platillos:', error);
    //         // Puedes devolver un observable de éxito o simplemente ignorar el error
    //         return of(null); // Ignorar el error y continuar con el intervalo
    //       })
    //     )
    //   )
    // ).subscribe(
    //   (resp: any) => {
    //     if (resp) {
    //       console.log("hola");
    //       this.platillos = resp.data;
    //       this.limpiarMensajes();
    //     }
    //   },
    //   (error) => {
    //     console.error('Error en la suscripción al intervalo:', error);
    //     this.messages = [
    //       {
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: 'No se pudieron obtener los platillos',
    //       },
    //     ];
    //     this.limpiarMensajes();
    //   }
    // );





    this.platillosService.obtenerPlatillos().then(
      (resp: any) => {
        this.platillos = resp.data;
        this.limpiarMensajes()
      },
      (error) => {
        this.messages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron obtener los platillos',
          },
        ];
        this.limpiarMensajes()
      }
    );
  }

  agregarPlatillo() {
    this.platillo = new Platillo();
    this.platillo.nombre = this.platilloForm.value.nombre;
    this.platillo.descripcion = this.platilloForm.value.descripcion;
    this.platillo.precio = this.platilloForm.value.precio;
    this.platillo.carreta = this.platilloForm.value.carreta;
    this.platillo.keyx = this.platilloForm.value.keyx
    console.log("esto se ira al backend", this.platillo);
    //se podria hacer asi pero ocupo instalarlo , por si algun dia lo quieres usar futuro kevin : npm install class-transformer class-validator
    //const platilloFromForm = plainToClass(Platillo, this.platilloForm.value);
    this.platillosService.agregarPlatillo(this.platillo).then((resultado: any) => {
      this.platillos = resultado.data;
      this.limpiarMensajes()
      this.messages = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'Se agrego el platillo con exito',
        },
      ];
      this.limpiarMensajes()
    })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
        this.messages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar el platillo',
          },
        ];
        this.limpiarMensajes()
      });
    this.platilloForm.reset();
    this.idPlatilloEditar = ''
    this.idPlatilloEditar = false

    this.visible = false;
  }

  editarPlatillo(platillo: any) {
    this.platilloForm.reset();
    // this.platilloForm = this.fb.group({nombre: [""],
    //   precio: [""],
    //   descripcion: [""],
    //   carreta: [""],
    //   keyx: [""]})
    this.platilloForm = this.fb.group({
      nombre: [platillo.nombre, Validators.required],
      precio: [platillo.precio, Validators.required],
      descripcion: [platillo.descripcion, Validators.required],
      carreta: [platillo.carreta, Validators.required],
      keyx: [platillo.keyx]
    });

    console.log(platillo);


    this.platilloForm.value

    console.log('esta mesa se va a editar', platillo);

  }

  eliminarPlatillo(keyx: number): void {
    console.log(keyx);
    // Actualizar la paginación después de eliminar un platillo
    this.platillosService
      .eliminarPlatillo(keyx)
      .then((resultado: any) => {
        this.platillos = resultado.data;
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Se elimino la mesa correctamente',
          },
        ];
        this.limpiarMensajes()
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
        this.messages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'Closable Message Content',
          },
        ];
        this.limpiarMensajes();
      });
    this.visible = false;
  }



  showDialog(i: any) {

    this.platilloForm.reset();
    console.log("esto es una numero : ", i);
    if (i != null) {
      this.ids[i];
      this.platillos[i];
      this.editarPlatillo(this.platillos[i]);
    }





    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  limpiarMensajes() {
    setTimeout(() => {
      this.messages = []
    }, 3000);
  }

}
