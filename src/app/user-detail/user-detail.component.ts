import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public userId!: number;
  userDetail!: User;

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService){}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val => {
      this.userId = val['id'];
      this.fetchUserDetail(this.userId);
    })
  }
  
  fetchUserDetail(userId: number){
    this.api.getRegisteredUserId(userId).subscribe(res => {
      this.userDetail = res;
    })

  }
}
