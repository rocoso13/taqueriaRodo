import { Component, Injectable } from '@angular/core';
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
import { Message } from 'primeng/api';

interface Product {
  name: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'],
})
export class MesasComponent {
  mesas: any[] = [];
  ids: any[] = [];
  comandaForm!: FormGroup;

  public numeroMesa: string = '';
  public platillos: Platillo[] = [];
  public platillosComandas : Platillo[] = [];
  public cantidadDePlatillos: number = 1;
  public idMesaActual : any;
  public mesaModalActual : any;
  first: number = 0;

  rows: number = 10;

  messages: Message[] = [];

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
      ]),
    });
  }

  displayModal: boolean = false;
  displayModalComanda: boolean = false;

  ngOnInit(): void {
    //esta funcion obtiene las mesas en tiempo real
    this.obtenerMesas();
    this.totalItems = this.mesas.length;
    this.comandaForm = this.fb.group({
      descripcion: ['', Validators.required],
      estatus: ['', Validators.required],
      mesa: ['', Validators.required],
    });
  }

  //funcion donde se abre el modal y te muestra si esa mesa tiene una comanda activa
  async showModal(mesa: any, idMesa: any) {
    this.comandaForm.reset();
    this.mesaModalActual = mesa;
    this.platillosComandas = [];
    let comandaActual : Promise<any[]>;
    console.log('se volvio a ejecutar este metodo');
    console.log(mesa)
    
    if (mesa.estatusComanda === 'enviar') {
      //consultarPlatillos por comanda y si no existe la comanda activa se incializa como vacio los platillos
      console.log('esto trae platillosComanda', this.platillosComandas)
      this.platillosComandas.length === 0 ? this.mesasService.obtenerPlatillosComanda(
        mesa.idComandaActual
      ).then(respuesta => {
        this.platillosComandas = respuesta;
      }) : [];

      comandaActual = this.mesasService.obtenerComanda(mesa.idComandaActual)

      comandaActual.then((respuesta) => {
        this.comandaForm = this.fb.group({
          descripcion: [respuesta[0], Validators.required],
          estatus: [respuesta[1], Validators.required]
        });
      })

      
    }

    this.numeroMesa = mesa.numeroMesa;
    this.idMesaActual = this.ids[idMesa];
    this.displayModal = true;
  }

  //esta funcion obtiene las mesas en tiempo real
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

  async showModalPlatillos() {
    this.displayModalComanda = true;
    this.platillos = await this.mesasService.obtenerPlatillos();
    console.log('platillos siuu');
    console.log(this.platillos);
  }

  agregarPlatilloComanda(platillo: Platillo) {
    console.log(platillo);
    this.platillosComandas.push(platillo);
  }

  incremetarPlatillo(i: any) {
    this.platillosComandas[i].cantidad++;
  }

  decrementarPlatillo(i: any) {
    this.platillosComandas[i].cantidad--;
  }

  eliminarPlatilloComanda(i: any) {
    this.platillosComandas.splice(i, 1);
  }

  async agregarComanda() {
    this.comandaForm.value.mesa = this.numeroMesa;
    let idComanda: any;
    console.log('entro al metodo');
    console.log(this.comandaForm.value);

    console.log(this.platillosComandas);

    await this.mesasService
      .agregarComanda(this.comandaForm.value, false, 0)
      .then((resultado) => {
        console.log('esto es en el component');
        console.log(resultado?.id);
        idComanda = resultado?.id;
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
          },
        ];
        this.limpiarMensajes();
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

      console.log('este es el id de la mesa actuliazar' , this.idMesaActual);
      

      await this.mesasService
      .guardarIdComandaEnMesa(idComanda, this.idMesaActual, this.mesaModalActual, this.comandaForm.value.estatus, this.mesaModalActual.idComandaActual.trim() == "" ? true : false)
      .then((resultado) => {
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
          },
        ];
        this.limpiarMensajes();
      })
      .catch((error) => {
        this.messages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'Closable Message Content',
          },
        ];
        this.limpiarMensajes();
      });




    //seccion guardado platillos
    this.platillosComandas.forEach((platillo) => {
      this.mesasService
        .agregarPlatillosComanda(
          platillo,
          false,
          0,
          idComanda,
          this.comandaForm.value.estatus
        )
        .then((resultado) => {
          this.messages = [
            {
              severity: 'success',
              summary: 'Success',
              detail: 'Message Content',
            },
          ];
          this.limpiarMensajes();
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
    });

    //hacer un await para que primero se grabde la comanda y luego grabar los platillos asociando el id de la comanda, se tendra que hacer una tabla de platillos para la comanda
  }

  limpiarMensajes() {
    setTimeout(() => {
      this.messages = [];
    }, 300);
  }
}
