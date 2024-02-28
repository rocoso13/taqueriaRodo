import { Component, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesasService } from './mesas.service/mesas.service';
import { Platillo } from '../platillos/models/Platillo';
import { Message } from 'primeng/api';
import { PedidoDTO } from './models/PedidoDTO';
import { ComandaDTO } from '../models/ComandaDTO';
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

  public numeroMesa: number = 0;
  public keyxMesa: number = 0;
  public platillos: Platillo[] = [];
  public platillosComandas: Platillo[] = [];
  public cantidadDePlatillos: number = 1;
  public idMesaActual: any;
  public mesaModalActual: any;
  public pedidoDTO: PedidoDTO = new PedidoDTO();

  messages: Message[] = [];

  // Propiedades para la paginación
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
    this.comandaForm = this.fb.group({
      descripcion: ['', Validators.required],
      estatus: ['', Validators.required],
      mesa: ['', Validators.required],
      keyx: ['']
    });
  }

  //funcion donde se abre el modal y te muestra si esa mesa tiene una comanda activa
  async showModal(mesa: any, idMesa: any) {
    this.comandaForm.reset();
    this.mesaModalActual = mesa;
    this.platillosComandas = [];
    let comandaActual: any;
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
    }

    this.mesasService.obtenerComanda(mesa).then(
      (resp: any) => {
        console.log(resp.data.comanda);
        this.comandaForm = this.fb.group({
          descripcion: [resp.data.comanda?.descripcion, Validators.required],
          estatus: [resp.data.comanda?.estatus, Validators.required],
          keyx: [resp.data.comanda?.keyx, Validators.required]
        });
        this.keyxMesa = resp.data.comanda?.keyx;
        comandaActual = resp.data.comanda;
        this.platillosComandas = resp.data.platillos;
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

    this.numeroMesa = mesa.numeroMesa;
    
    this.idMesaActual = this.ids[idMesa];
    this.displayModal = true;
  }

  //esta funcion obtiene las mesas en tiempo real
  async obtenerMesas() {
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

  async showModalPlatillos() {
    this.displayModalComanda = true;
    this.platillos = await this.mesasService.obtenerPlatillos();
  }

  agregarPlatilloComanda(platillo: Platillo) {
    platillo.cantidad = 1;
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
    this.pedidoDTO = new PedidoDTO();
    let comandaDTO = new ComandaDTO();
    let platillosComanda = new Platillo();

    //seteo de valores 
    this.platillosComandas.forEach(platilloComanda => {
      platillosComanda = new Platillo();
      platillosComanda.keyx = platilloComanda.keyx;
      platillosComanda.carreta = platilloComanda.carreta;
      platillosComanda.descripcion = platilloComanda.descripcion;
      platillosComanda.nombre = platilloComanda.nombre;
      platillosComanda.precio = platilloComanda.precio;
      platilloComanda.cantidad = platilloComanda.cantidad;
      this.pedidoDTO.platillosComanda.push(platilloComanda);
    })
    this.pedidoDTO.comandaDTO.descripcion = this.comandaForm.value.descripcion;
    this.pedidoDTO.comandaDTO.estatus = this.comandaForm.value.estatus;
    this.pedidoDTO.comandaDTO.keyx = this.keyxMesa;
    this.pedidoDTO.comandaDTO.numeroMesa = this.numeroMesa;

    this.comandaForm.value.mesa = this.numeroMesa;
    let idComanda: any;
    console.log('entro al metodo');
    console.log(this.comandaForm.value);

    console.log(this.platillosComandas);

    console.log("nuevos datos", this.pedidoDTO);


    this.mesasService.agregarComanda(this.pedidoDTO).then(
      (resp: any) => {
        console.log(resp);

        // this.mesas = resp.data;
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
    console.log('este es el id de la mesa actuliazar', this.idMesaActual);
  }

  limpiarMensajes() {
    setTimeout(() => {
      this.messages = [];
    }, 300);
  }
}
