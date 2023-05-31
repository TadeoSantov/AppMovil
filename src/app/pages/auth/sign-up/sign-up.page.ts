import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { CustomValidators } from '../../../utils/custom-validators';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('')
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
    
  ) { }

  /*private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService*/

  ngOnInit() {

     this.confirmPasswordValidator();

  }

  confirmPasswordValidator(){
    this.form.controls.confirmpassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ])

    this.form.controls.confirmpassword.updateValueAndValidity();

  }

  submit() {
    if (this.form.valid) {

       
    
      this.utilSvc.presentLoading({message: 'Registrando...'})
      this.firebaseSvc.signUp(this.form.value as User ).then(async res => {
        console.log(res);

        await this.firebaseSvc.updateUser({displayName: this.form.value.name})

        let user: User ={
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilSvc.setElementInLocalstorage('user', user);
        this.utilSvc.routerLink('/tabs/home');

        this.utilSvc.dismissLoading();
        this.utilSvc.presentToast({
          message: 'Te damos la bienvenida ' + user.name,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline',
        });
        
        this.form.reset();

      }, error =>{

        this.utilSvc.dismissLoading();

        this.utilSvc.presentToast({message: error,
        duration: 5000,
        color: 'warning',
        icon: 'alert-circle-outline',
        })
      })



    }
  }

}
