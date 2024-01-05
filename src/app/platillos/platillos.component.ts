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
  public esEdicion : boolean = false;
  ids: string[] = [];
  public mesaEditar : [] = []
  public idPlatilloEditar: any;
  public platillo: Platillo = new Platillo();

  platilloForm!: FormGroup;

  constructor(private platillosService: PlatillosService, private fb: FormBuilder) {}

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
    this.platillosService.obtenerPlatillos().then(
      (resp : any) => {
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
    console.log(this.platillo);
    //se podria hacer asi pero ocupo instalarlo , por si algun dia lo quieres usar futuro kevin : npm install class-transformer class-validator
    //const platilloFromForm = plainToClass(Platillo, this.platilloForm.value);
      this.platillosService.agregarPlatillo(this.platillo).then((resultado) => {
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

    
  }

  editarPlatillo(platillo: any, id: any) {
    this.platilloForm = this.fb.group({
      nombre: [platillo.nombre, Validators.required],
      precio: [platillo.precio, Validators.required],
      descripcion: [platillo.descripcion, Validators.required],
      carreta: [platillo.carreta, Validators.required]
    });
    this.idPlatilloEditar = id;

    this.platilloForm.value

    console.log('esta mesa se va a editar',platillo);   
    
  }

  eliminarPlatillo(index: number): void {
    console.log(index);
    console.log(this.ids[index]);
    // Actualizar la paginación después de eliminar una mesa
    this.platillosService
      .eliminarPlatillo('platillos', this.ids[index])
      .then((resultado) => {
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Se elimino la mesa correctamente',
          },
        ];
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
      });
  }

  visible: boolean = false;

  showDialog(i : any) {
    console.log("esto es una numero : ",i);
    
    i == null ? this.esEdicion = false : this.esEdicion = true;
    this.ids[i];
    this.platillos[i];
    if (this.platillos[i] != undefined) {
      this.editarPlatillo(this.platillos[i], this.ids[i]);
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
