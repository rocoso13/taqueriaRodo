
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

@Injectable({
  providedIn: 'root',
})
export class PlatillosService {

  async eliminarPlatillo(collection: string, idDoc: string) {
    await deleteDoc(doc(db, collection, idDoc));
    
  }

  async agregarPlatillo(platillo: any, esEdicion : boolean, id : any){
    console.log(platillo);
    if (esEdicion) {
      await setDoc(doc(db, "platillos", id), {
        nombre : platillo.nombre,
        descripcion : platillo.descripcion,
        precio : platillo.precio,
        carreta : platillo.carreta
      });
    } else{
      try {
        await addDoc(collection(db, "platillos"), {
            nombre : platillo.nombre,
            descripcion : platillo.descripcion,
            precio : platillo.precio,
            carreta : platillo.carreta
        });
        console.log('Documento agregado con éxito');
      } catch (error) {
        console.error('Error al agregar el documento: ', error);
      }
    }
    
  }

  async editarMesa(mesa: any, id: any){
    await setDoc(doc(db, "platillos", id), {
      estatus : mesa.estatus,
        habilitada : mesa.habilitada,
        numeroMesa : mesa.numero
    });
  }
}
