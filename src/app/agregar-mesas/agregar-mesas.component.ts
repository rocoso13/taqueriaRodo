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
  public esEdicion: boolean = false;
  ids: string[] = [];
  public mesaEditar: [] = []
  public idMesaEditar: any;
  public visible: boolean = false;

  agarrarMesas = [];
  mesaForm!: FormGroup;

  public mesa: Mesa = new Mesa();





  constructor(private mesasService: MesasService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerMesas();

    this.mesaForm = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      estatus: [null, Validators.required],
      habilitada: [null, Validators.required],
    });
  }

  async obtenerMesas() {
    // const q = query(collection(db, 'mesas'));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   console.log(snapshot.docs);
    //   this.mesas = [];
    //   this.ids = [];
    //   snapshot.docs.forEach((mesa) => {
    //     this.mesas.push(mesa.data());
    //     this.ids.push(mesa.id);
    //   });
    // });


    this.mesasService.obtenerMesas().then(
      (resp: any) => {
        this.mesas = resp.data;
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

  agregarMesa() {

    // numeroMesa: number = 0;
    // estatus: number = 0;
    // habilitada: number = 0;
    this.mesa = new Mesa();
    this.mesa.numeroMesa = this.mesaForm.value.numero;
    this.mesa.estatus = this.mesaForm.value.estatus;
    this.mesa.habilitada = this.mesaForm.value.habilitada;
    this.mesa.keyx = this.mesaForm.value.keyx
    console.log("esto se ira al backend", this.mesa);
    //se podria hacer asi pero ocupo instalarlo , por si algun dia lo quieres usar futuro kevin : npm install class-transformer class-validator
    //const platilloFromForm = plainToClass(Platillo, this.platilloForm.value);
    this.mesasService.agregarMesa(this.mesa).then((resultado: any) => {
      this.mesas = resultado.data;
      this.limpiarMensajes()
      this.messages = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'Se agrego la mesa con exito',
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
            detail: 'No se pudo agregar la mesa',
          },
        ];
        this.limpiarMensajes()
      });
    this.mesaForm.reset();
    this.idMesaEditar = ''
    this.idMesaEditar = false

    this.visible = false;


  }

  editarMesa(mesa: any, id: any) {
    this.mesaForm = this.fb.group({
      numero: [mesa.numeroMesa, [Validators.required, Validators.min(1)]],
      estatus: [mesa.estatus, Validators.required],
      habilitada: [mesa.habilitada, Validators.required],
      keyx: [mesa.keyx]
    });
    this.idMesaEditar = id;

    this.mesaForm.value


    console.log('esta mesa se va a editar', mesa);


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

  eliminarAgregarMesa(keyx: number): void {
    console.log(keyx);
    // Actualizar la paginación después de eliminar un platillo
    this.mesasService
      .eliminarAgregarMesa(keyx)
      .then((resultado: any) => {
        this.mesas = resultado.data;
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
    this.mesaForm.reset();
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
