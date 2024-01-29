import { Injectable } from '@angular/core';

// import { Firestore, addDoc } from '@angular/fire/firestore';

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
  addDoc,
} from 'firebase/firestore';
import { db } from 'src/app/DB Fire Base/conexion-FireBase';
import { Platillo } from 'src/app/platillos/models/Platillo';

import { HttpClient } from '@angular/common/http';
import { PlatillosService } from 'src/app/platillos/platillos.service/platillos.service';
import { PedidoDTO } from '../models/PedidoDTO';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  public platillos: Platillo[] = [];
  public platillosComanda: Platillo[] = [];
  //   async eliminarPlatillo(collection: string, idDoc: string) {
  //     await deleteDoc(doc(db, collection, idDoc));

  //   }
  apiRoot: string = "http://localhost:8080/agregarMesas";
  apiRootComanda : string = "http://localhost:8080/comandas"

  constructor(private http: HttpClient, private platillosService: PlatillosService){}

  async obtenerPlatillos() {
    this.platillos = [];
    await this.platillosService.obtenerPlatillos().then(
      (resp: any) => {
        this.platillos = resp.data;
      },
      (error) => {
        
      }
    );
    return this.platillos;
  }

  // async obtenerComanda(id : any) {
  //   // {
  //   //     "descripcion": "prueba",
  //   //     "mesa": 16,
  //   //     "estatus": "enviar"
  //   // }
  //   let comandaActual = [];
  //   const docRef = doc(db, "comandas", id);
  //   const docSnap = await getDoc(docRef);
  //   console.log('comanda actual');
  //   comandaActual.push(docSnap.data()!['descripcion'])
  //   comandaActual.push(docSnap.data()!['estatus'])
  //   console.log(docSnap.data());
    
  //   return comandaActual;
  // }

  async obtenerPlatillosComanda(idComanda: any) {
    this.platillosComanda = [];
    if (true) {
      const platillosComandaRef = collection(db, 'platillosComanda');
      const q = query(
        platillosComandaRef,
        where('estatus', '==', 'enviar'),
        where('idComanda', '==', idComanda)
      );
      console.log('paso por aqui');
      console.log(q);

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let modelPlatillo = new Platillo();
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
        modelPlatillo.descripcion = doc.data()['descripcion'];
        modelPlatillo.nombre = doc.data()['nombre'];
        modelPlatillo.precio = doc.data()['precio'];
        modelPlatillo.carreta = doc.data()['carreta'];
        this.platillosComanda.push(modelPlatillo);
      });
      return this.platillosComanda;
    }
  }

  // async agregarComanda(comanda: any, esEdicion: boolean, id: any) {
  //   console.log(comanda);
  //   let queTrae;
  //   if (esEdicion) {
  //     await setDoc(doc(db, 'comandas', id), {
  //       descripcion: comanda.descripcion,
  //       estatus: comanda.estatus,
  //       mesa: comanda.mesa,
  //     });
  //   } else {
  //     try {
  //       queTrae = await addDoc(collection(db, 'comandas'), {
  //         descripcion: comanda.descripcion,
  //         estatus: comanda.estatus,
  //         mesa: comanda.mesa,
  //       });
  //       console.log('Documento agregado con éxito');
  //       console.log(queTrae.id);
  //     } catch (error) {
  //       console.error('Error al agregar el documento: ', error);
  //     }
  //   }
  //   return queTrae;
  // }

  async agregarPlatillosComanda(
    platillos: any,
    esEdicion: boolean,
    id: any,
    idComanda: any,
    estatusMesa: any
  ) {
    console.log(platillos);
    let queTrae;
    if (esEdicion) {
      await setDoc(doc(db, 'platillosComanda', id), {
        descripcion: platillos.descripcion,
        estatus: platillos.estatus,
        mesa: platillos.mesa,
      });
    } else {
      try {
        queTrae = await addDoc(collection(db, 'platillosComanda'), {
          nombre: platillos.nombre,
          precio: platillos.precio,
          estatus: estatusMesa,
          idComanda: idComanda,
        });
        console.log('Documento agregado con éxito');
        console.log(queTrae.id);
      } catch (error) {
        console.error('Error al agregar el documento: ', error);
      }
    }
    return queTrae;
  }

  async guardarIdComandaEnMesa(idComanda: any, idMesa : any, mesa : any, estatusComanda : any, esEdicion : boolean) {
    console.log('entro a actualizar o crear la mesa');
    
    console.log(idComanda);
    console.log(idComanda, idMesa, mesa, estatusComanda, esEdicion)
    try {
        
    
    await setDoc(doc(db, "mesas", idMesa), {
        idComandaActual : idComanda,
        estatus : 'enviar',
          habilitada : mesa.habilitada,
          numeroMesa : mesa.numeroMesa,
          estatusComanda : estatusComanda
      });
    } catch (error) {
        console.log('valio vrg perrio', error);
        
    }









     
  }

  obtenerMesas() {
    return this.http.get(`${this.apiRoot}/obtenerAgregarMesas`).toPromise();
  }

  async obtenerComanda(mesa: any) {
    return this.http.post(`${this.apiRootComanda}/obtenerComanda`, mesa).toPromise();
  }

  async agregarComanda(pedidoDTO: PedidoDTO) {
    return this.http.post(`${this.apiRootComanda}/agregarComanda`, pedidoDTO).toPromise();
  }
}
