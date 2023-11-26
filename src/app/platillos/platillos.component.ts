// mesas.component.ts
import { Component } from '@angular/core';

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

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

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
  public idPlatilloEditar : any;

  platilloForm!: FormGroup;

  first: number = 0;

  rows: number = 10;

  // Propiedades para la paginación
  totalItems: number = 0;
  itemsPerPage: number = 10; // ajusta según tus necesidades
  currentPage: number = 1;

  constructor(private platillosService: PlatillosService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerPlatillos();
    this.totalItems = this.platillos.length;

    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required],
      carreta: ['', Validators.required]
      // Agrega carreta e imagen según tus necesidades
    });
  }

  async obtenerPlatillos() {
    const q = query(collection(db, 'platillos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs);
      this.platillos = [];
      this.ids = [];
      snapshot.docs.forEach((platillo) => {
        this.platillos.push(platillo.data());
        this.ids.push(platillo.id);
      });
    });
  }

  agregarPlatillo() {
    console.log("entro a mesassiuu")
    console.log(this.platilloForm.value.numero);
    console.log(this.platilloForm.value);
      console.log(this.esEdicion);
      this.platillosService.agregarPlatillo(this.platilloForm.value, this.esEdicion, this.idPlatilloEditar).then((resultado) => {
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
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
        this.limpiarMensajes()
      });
      this.platilloForm.reset();
      this.idPlatilloEditar = ''
      this.idPlatilloEditar = false

      // Actualizar la paginación después de agregar un nuevo PLATILLO
      this.totalItems = this.platillos.length;
      this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
    
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
    this.totalItems = this.platillos.length;

    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
  }

  visible: boolean = false;

  showDialog(i : any) {
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
    }, 300);
  }

}
