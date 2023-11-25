// mesas.service.ts
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
import { Mesa } from '../models/agregarMesa';
import { db } from 'src/app/DB Fire Base/conexion-FireBase';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  private mesas: Mesa[] = [
    // Agrega más mesas según sea necesario
  ];

  async eliminarMesa(collection: string, idDoc: string) {
    await deleteDoc(doc(db, collection, idDoc));
    
  }

  async agregarMesa(mesa: any, esEdicion : boolean, id : any){
    console.log(mesa);
    if (esEdicion) {
      await setDoc(doc(db, "mesas", id), {
        estatus : mesa.estatus,
          habilitada : mesa.habilitada,
          numeroMesa : mesa.numero
      });
    } else{
      try {
        await addDoc(collection(db, "mesas"), {
          estatus : mesa.estatus,
          habilitada : mesa.habilitada,
          numeroMesa : mesa.numero
        });
        console.log('Documento agregado con éxito');
      } catch (error) {
        console.error('Error al agregar el documento: ', error);
      }
    }
    
  }

  async editarMesa(mesa: any, id: any){
    await setDoc(doc(db, "mesas", id), {
      estatus : mesa.estatus,
        habilitada : mesa.habilitada,
        numeroMesa : mesa.numero
    });
  }
}
