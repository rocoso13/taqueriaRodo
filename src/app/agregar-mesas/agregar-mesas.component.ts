// mesas.component.ts
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mesa } from './models/agregarMesa';
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
import { MesasService } from './agregarMesas.service/agregarMesas.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-agregar-mesas',
  templateUrl: './agregar-mesas.component.html',
  styleUrls: ['./agregar-mesas.component.css']
})
export class AgregarMesasComponent {
  mesas: any[] = [];
  messages: Message[] = [];
  public esEdicion : boolean = false;
  ids: string[] = [];
  public mesaEditar : [] = []
  public idMesaEditar : any;

  agarrarMesas = [];
  mesaClass = new Mesa();
  mesaForm!: FormGroup;

  first: number = 0;

  rows: number = 10;

  // Propiedades para la paginación
  totalItems: number = 0;
  itemsPerPage: number = 10; // ajusta según tus necesidades
  currentPage: number = 1;

  constructor(private mesasService: MesasService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerMesas();
    this.totalItems = this.mesas.length;

    this.mesaForm = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      estatus: [null, Validators.required],
      habilitada: [null, Validators.required],
    });
  }

  async obtenerMesas() {
    const q = query(collection(db, 'mesas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs);
      this.mesas = [];
      this.ids = [];
      snapshot.docs.forEach((mesa) => {
        this.mesas.push(mesa.data());
        this.ids.push(mesa.id);
      });
    });
  }

  agregarMesa() {
    console.log("entro a mesassiuu")
    console.log(this.mesaForm.value.numero);
    console.log(this.mesaForm.value);
      const nuevaMesa: Mesa = this.mesaForm.value;
      console.log(this.esEdicion);
      this.mesasService.agregarMesa(this.mesaForm.value, this.esEdicion, this.idMesaEditar).then((resultado) => {
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
      this.mesaForm.reset();
      this.idMesaEditar = ''
      this.idMesaEditar = false

      // Actualizar la paginación después de agregar una nueva mesa
      this.totalItems = this.mesas.length;
      this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
    
  }

  editarMesa(mesa: any, id: any) {
    this.mesaForm = this.fb.group({
      numero: [mesa.numeroMesa, [Validators.required, Validators.min(1)]],
      estatus: [mesa.estatus, Validators.required],
      habilitada: [mesa.habilitada, Validators.required],
    });
    this.idMesaEditar = id;

    this.mesaForm.value


    console.log('esta mesa se va a editar',mesa);


    // this.mesasService.editarMesa(this.mesaForm.value, id).then((resultado) => {
    //   this.messages = [
    //     {
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Message Content',
    //     },
    //   ];
    //   this.limpiarMensajes()
    // })
    // .catch((error) => {
    //   console.error('Error al obtener datos:', error);
    //   this.messages = [
    //     {
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Closable Message Content',
    //     },
    //   ];
    //   this.limpiarMensajes()
    // });
   
    
  }

  eliminarMesa(index: number): void {
    console.log(index);
    console.log(this.ids[index]);
    // Actualizar la paginación después de eliminar una mesa
    this.mesasService
      .eliminarMesa('mesas', this.ids[index])
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
    this.totalItems = this.mesas.length;

    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
  }

  visible: boolean = false;

  showDialog(i : any) {
    i == null ? this.esEdicion = false : this.esEdicion = true;
    this.ids[i];
    this.mesas[i];
    if (this.mesas[i] != undefined) {
      this.editarMesa(this.mesas[i], this.ids[i]);
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
