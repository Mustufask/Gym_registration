import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/compat/database';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import 'firebase/database'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // enquiries$: Observable<any[]>;
  items!: any[];
  
  private baseUrl: string = 'http://localhost:3000/enquiry';
  constructor(private http: HttpClient,
    //  private db: AngularFireDatabase
     ) { 
    // this.enquiries$ = this.db.list('/enquiry', (ref: { orderByChild: (arg0: string) => any; }) => ref.orderByChild('enquiry')).valueChanges();
    // this.db.list('/enquiry').valueChanges().subscribe((items: any[]) => {
      // this.items = items;
  // })
      
  }



  postRegistration(registerObj: User){
    return this.http.post<User>(`${this.baseUrl}`, registerObj);
  }

  getRegisteredUser(){
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  updateRegistedUser(registerObj: User, id: number){
    return this.http.put<User>(`${this.baseUrl}/${id}`, registerObj);
  }

  deleteRegistered(id: number){
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }
  
  getRegisteredUserId(id: number){
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
}
