import { Injectable , EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
//
import { Subscription } from 'rxjs/internal/Subscription';    
import { MembersComponent } from 'src/app/members/members.component';
import { MemberDetailsComponent } from 'src/app/member-details/member-details.component';


interface myData{
  success: boolean,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // If false, the application will run on 4200 and call json-server directly
  // If true, the application will utilize node API
  DEBUG: Boolean = true;
  api: string;
  username: string;
  //
  members = [];

  private loggedInStatus = false;
   
  constructor(private http: HttpClient,) {
    if (this.DEBUG) {
      this.api = 'http://localhost:3000';
    } else {
      this.api = 'http://localhost:8000/api';
    }
  }
 setLoggedIn(value: boolean){
    this.loggedInStatus = value;
 }
 get isLoggedIn(){
   return this.loggedInStatus;
 }

  // Returns all members
  getMembers() {
      return this.http.get(`${this.api}/members`).pipe(catchError(this.handleError));
    
  }
  getMemberSpecific(id : Number){
    return this.http.get(`${this.api}/members[id]`).pipe(catchError(this.handleError));
  }
  
  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm) {
    return this.http.post(`${this.api}/members`, memberForm).pipe(catchError(this.handleError));
     }

  getTeams() {
    return this.http.get(`${this.api}/teams`).pipe(catchError(this.handleError));
  }

  deleteMemberHere(id){
    return this.http.delete(`${this.api}/members/`+id);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return [];
  }
}

