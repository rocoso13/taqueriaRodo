// mesas.component.ts
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mesa } from './models/agregarMesa';
import { MesasService } from './agregarMesas.service/agregarMesas.service';
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
  ids : string[] = [];

  agarrarMesas = [];
  mesaClass = new Mesa();
  mesaForm!: FormGroup;

  first: number = 0;

    rows: number = 10;

  // Propiedades para la paginación
  totalItems: number =0;
  itemsPerPage: number = 5; // ajusta según tus necesidades
  currentPage: number = 1;

  

  constructor(private mesasService: MesasService, private fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.obtenerMesas();
    this.totalItems = this.mesas.length;

    this.mesaForm = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      estatus: [null, Validators.required],
      color: [null, Validators.required],
      habilitada: [null, Validators.required],
    });
  }

//   {
//     "habilitada": 2,
//     "numeroMesa": 2,
//     "estatus": 2
// }

 async obtenerMesas(){
    // await this.mesasService.obtenerMesas().then((data) => {
    //   console.log('Resultado exitoso:', data);
    //   this.ids = data.ids;
    //   data.mesas.forEach(mesa => {
    //     this.mesaClass = new Mesa();
    //     this.mesaClass.numero = mesa['numeroMesa'];
    //     this.mesaClass.habilitada = mesa['habilitada'];
    //     this.mesaClass.estatus = mesa['estatus'];
    //     this.mesas.push(this.mesaClass);
    //   })
    //   console.log('siuu');
    //   console.log(this.mesas);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // })
    // return []

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

  agregarMesa(): void {
    if (this.mesaForm.valid) {
      const nuevaMesa: Mesa = this.mesaForm.value;
      this.mesaForm.reset();
      // Actualizar la paginación después de agregar una nueva mesa
      this.totalItems = this.mesas.length;
      this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  editarMesa(i : any){
    console.log(i)
    console.log(this.ids[i])
  }

  eliminarMesa(index: number): void {

    console.log(index)
    console.log(this.ids[index])
    // Actualizar la paginación después de eliminar una mesa
    this.mesasService.eliminarMesa('mesas', this.ids[index]).then((resultado) => {
      this.messages = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];
      this.mesas.splice(index, 1);

    }).catch((error) => {
      console.error("Error al obtener datos:", error);
      this.messages  = [{ severity: 'error', summary: 'Error', detail: 'Closable Message Content' }];
    });
    this.totalItems = this.mesas.length;

    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(event : any): void {
    this.currentPage = event.page + 1;
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
}

