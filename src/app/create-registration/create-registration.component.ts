import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css']
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public genders: string[] = ['Male', 'Female'];
  public importantList: string[] = [
    'Toxic Fat Reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness'
  ]

  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private api: ApiService, 
    private toastService: NgToastService,
    private router: Router
    ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email:  [null, [Validators.required, Validators.email]],
      mobile: [null, Validators.required],
      weight: [null, Validators.required],
      height: [null, Validators.required],
      bmi: [null],
      bmiResult: [null],
      gender: [null, Validators.required],
      requireTrainer: [null, Validators.required],
      package: [null, Validators.required],
      important: [null, Validators.required],
      haveGymBefore: [null, Validators.required],
      enquiryDate: [null, Validators.required]
    });

    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe(val => {
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res => {
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      })
    })
  }

  submit(){
    console.log(this.registerForm.value.id)
    this.api.postRegistration(this.registerForm.value).subscribe(res => {
      this.toastService.success({detail: 'Success', summary: 'Enquiry Added', duration: 3000});
      this.registerForm.reset();
    })
  }
  
  update(){
    this.api.updateRegistedUser(this.registerForm.value, this.userIdToUpdate).subscribe(res => {
      this.toastService.success({detail: 'Success', summary: 'Enquiry Updated', duration: 3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    })
  }

  fillFormToUpdate(user: User){
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }

  calculateBmi(heightValue: number){
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch(true){
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('Underweight')
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue('Normal')
        break;
      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue('Overweight')
        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue('Obese')
        break;
    }
  }
}
