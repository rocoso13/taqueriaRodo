import { Component } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesasService } from './mesas.service/mesas.service';
import { Platillo } from '../platillos/models/Platillo';

interface Product {
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent {
  mesas: any[] = [];
  ids : any[] = [];
  comandaForm!: FormGroup;

  public numeroMesa: string = '';
  public platillos : Platillo[] = [];
  public platillosComandas : Platillo[] = [];
  public cantidadDePlatillos : number = 1

  first: number = 0;

  rows: number = 10;

  // Propiedades para la paginación
  totalItems: number = 0;
  itemsPerPage: number = 10; // ajusta según tus necesidades
  currentPage: number = 1;
  productsForm: FormGroup;

  constructor(private mesasService: MesasService, private fb: FormBuilder) {
    this.productsForm = this.fb.group({
      products: this.fb.array([
        { name: 'Producto 1', quantity: 2 },
        { name: 'Producto 2', quantity: 1 },
      ])
    });
  }

  displayModal: boolean = false;
  displayModalComanda: boolean = false;
  showModal(mesa : any) {
  //   {
  //     "habilitada": 1,
  //     "numeroMesa": 16,
  //     "estatus": 1
  // }
  this.numeroMesa = mesa.numeroMesa;
    console.log(mesa)
    this.displayModal = true;
  }

  ngOnInit(): void {
    this.obtenerMesas();
    this.totalItems = this.mesas.length;


    this.comandaForm = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      estatus: [null, Validators.required],
      habilitada: [null, Validators.required],
    });
    this.productsForm = this.fb.group({
      products: this.fb.array([])
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

  enviarComanda(){

  }

  async showModalPlatillos(){
    this.displayModalComanda = true;
    this.platillos = await this.mesasService.obtenerPlatillos();
    console.log('platillos siuu');
    console.log(this.platillos)
  }

  agregarPlatilloComanda(platillo : Platillo){
    console.log(platillo)
    this.platillosComandas.push(platillo);
  }

  incremetarPlatillo(i : any){
    // this.cantidadDePlatillos++
    this.platillosComandas[i].cantidad++
  }

  decrementarPlatillo(i : any){
    // this.cantidadDePlatillos--
    this.platillosComandas[i].cantidad--
  }

  eliminarPlatilloComanda(i : any){
    this.platillosComandas.splice(i, 1);
  }

  
}
