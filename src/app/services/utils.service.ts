import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../models/task-model';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }


  //LOADING


    //present
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }

  //dismiss
  async dismissLoading(){
    return await this.loadingController.dismiss();
  }

//Local Storage

//set
  setElementInLocalstorage(key: string, element: any ){
    return localStorage.setItem(key, JSON.stringify(element))

  }

//get
  getElementFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }



  //router
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

//Alert
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
  
    await alert.present();
  }

  //Modal
//Presente
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();

    if(data){
      return data;
    }
  
  }
//dismiss
  dismissModal(data?: any){
    this.modalController.dismiss(data);
  }

  getPercentage(task: Task){
 

   let completedItems = task.items.filter(item => item.completed).length;
    let totalItems = task.items.length;
    let percentage = (100 / totalItems) * completedItems;

    return parseInt(percentage.toString());
  }


}
