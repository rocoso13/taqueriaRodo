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

  async obtenerMesas() {
    console.log('hola');
    let mesas: DocumentData[] = [];
    let mesass: any[] = [];
    let ids: string[] = [];

    
    

    // const querySnapshot = await getDocs(collection(db, 'mesas'));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, ' => ', doc.data());
    //   mesas.push(doc.data());
    //   ids.push(doc.id);
    // });

    // console.log('hola2')

    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   console.log("No se encontro el documento!");
    // }
    console.log(mesas);
    return { mesas, ids };
  }

  async eliminarMesa(collection: string, idDoc: string) {
    await deleteDoc(doc(db, collection, idDoc));
  }
}
