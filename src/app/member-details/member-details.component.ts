import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersComponent } from 'src/app/members/members.component';
import { ActivatedRoute } from '@angular/router';
//
import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';
import { RouterModule } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  //
  members = this.appService.getMembers().subscribe(members => (this.members = members));
  
  public memberIdFromRoute;
  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private _route: ActivatedRoute ) {
      this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      team: ['', Validators.required],
      status: ['', Validators.required]
  });
  }

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));   
    this.appService.getTeams().subscribe(teams => (this.teams = teams));   

    let id = parseInt(this._route.snapshot.paramMap.get('id'));
    this.memberIdFromRoute = id;
    if (id > 1){

      let oldMember = this.appService.getMemberSpecific(id).subscribe(members => (this.members = oldMember));

        oldMember = this.fb.group({
          firstName: this.memberForm.value.firstName,
          lastName: this.memberForm.value.lastName,
          jobTitle: this.memberForm.value.jobTitle,
          team: this.memberForm.value.team,
          status: this.memberForm.value.status,
    });
    }
    else {
      this.memberForm = Object.assign({}, this.appService.members[id]);
    }
  }

  ngOnChanges() {
   this.appService.getMembers().subscribe(members => (this.members = members));   
  }

  private getMemberSpecific(id: number){
    if (id === 0){
      this.memberModel = {
        firstName: '',
        lastName: '',
        jobTitle: '',
        team: '',
        status: ''
      }  
      this.memberForm.reset();
    }
    else {
      this.members[id] = Object.assign({}, this.appService.getMemberSpecific(id));
    }
  }

  // TODO: Add member to members
  // onSubmit(form: FormGroup) {
  //   if(form.value.id === null){
  //     const maxid = this.members.reduce(function(e1, e2){
  //       return (e1.id > e2.id) ? e1 : e2;
  //     }).id;
  //     this.memberModel = form.value;
  //     this.appService.addMember(this.memberModel)
  //         .subscribe((member) => {
  //             this.appService.members.push(member);
  //         });
  //         form.value.id = maxid+1;
  //         this.router.navigate(['members']);
  //   }  
  //   else{
  //     const foundIndex = this.members.findIndex(e => e.id === this.members.id);
  //     this.members[foundIndex] = this.members;
  //     this.appService.addMember(this.memberModel)
  //     .subscribe((member) => {
  //         this.appService.members.push(member);
  //     });
  //     this.router.navigate(['members']);
  //   }
  // }

    onSubmit(form: FormGroup) {
      this.memberModel = form.value;
      this.appService.addMember(this.memberModel)
          .subscribe((member) => {
              this.appService.members.push(member);
          });
          this.router.navigate(['members']);
 
   }
}
//Hey, so I solved a decent percentage of the assignment along with the bonus task within the 1hr time limit 
//mentioned by my recruiter. 
//I still have some work left on the edit member functionality, but I don't want to be unethical and take extra time.
//I sincerely hope that you request an interview, and I'll be more than happy to walk you through my thought process. 
//I am really grateful for your time, hopefully we get to work together some day :))