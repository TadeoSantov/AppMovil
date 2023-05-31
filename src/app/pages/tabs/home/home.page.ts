import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from '../../../models/task-model';
import { User } from '../../../models/user.model';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilsService } from '../../../services/utils.service';
import { AddUpdateTaskComponent } from '../../../shared/components/add-update-task/add-update-task.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user = {} as User;
  tasks: Task[] = [];
  loading: boolean = false;



  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTasks();
    this.getUser();
  }

  getUser() {
    return this.user = this.utilSvc.getElementFromLocalStorage('user');
  }


  getPercentage(task: Task){
    return this.utilSvc.getPercentage(task);
  }

  async addOrUpdateTask(task?: Task){
   let res = await this.utilSvc.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: {task},
      cssClass: 'add-update-modal'
    })

    if(res && res.success){
      this.getTasks();
    }
  }

  getTasks() {
    let user: User = this.utilSvc.getElementFromLocalStorage('user');
    let path = `users/${user.uid}`;

    this.loading = true;
    
   let sub = this.firebaseSvc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        console.log(res);
        this.tasks = res;
        sub.unsubscribe();
        this.loading = false;
        
      }
    })
      
  }


  confirmDeleteTask(task: Task){
    this.utilSvc.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar la tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteTask(task);
          }
        }
      ]
    })
  }

  deleteTask(task: Task) {
    let path = `users/${this.user.uid}/tasks/${task.id}`;

    this.utilSvc.presentLoading();
 

    this.firebaseSvc.deleteDocument(path).then(res => {


      this.utilSvc.presentToast({
        message: 'Tarea eliminada',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.getTasks();  
      this.utilSvc.dismissLoading();

    }, error => {

      this.utilSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilSvc.dismissLoading()

    })
  }


}
