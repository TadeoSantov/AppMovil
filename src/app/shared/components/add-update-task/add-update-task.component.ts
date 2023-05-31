import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { User } from '../../../models/user.model';
import { Task, item } from '../../../models/task-model';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilsService } from '../../../services/utils.service';


@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent implements OnInit {

  @Input() task: Task;

  user = {} as User

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl
    ([], [Validators.required, Validators.minLength(1)]),
  })

  constructor(
    private utilSvc: UtilsService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.user = this.utilSvc.getElementFromLocalStorage('user');

    if (this.task) {
      this.form.setValue(this.task);
      this.form.updateValueAndValidity();
    }
  }


  //Crear o actulizar
  submit() {

    if (this.form.valid) {
      if (this.task) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }

  }

  //Crear tarea
  createTask() {
    let path = `users/${this.user.uid}`;

    this.utilSvc.presentLoading();
    delete this.form.value.id;

    this.firebaseSvc.addToSubcollection(path, 'tasks', this.form.value).then(res => {

      this.utilSvc.dismissModal({ success: true });

      this.utilSvc.presentToast({
        message: 'Tarea creada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.utilSvc.dismissLoading()

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

  //Editar tarea
  updateTask() {
    let path = `users/${this.user.uid}/tasks/${this.task.id}`;

    this.utilSvc.presentLoading();
    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(res => {

      this.utilSvc.dismissModal({ success: true });

      this.utilSvc.presentToast({
        message: 'Tarea actualizada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.utilSvc.dismissLoading()

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


  getPercentage() {
    return this.utilSvc.getPercentage(this.form.value as Task);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.form.value.items = ev.detail.complete(this.form.value.items);
    this.form.updateValueAndValidity();
  }

  removeItem(index: number) {
    this.form.value.items.splice(index, 1);
    this.form.controls.items.updateValueAndValidity();
  }

  createItem() {
    this.utilSvc.presentAlert({
      header: 'Nueva Actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        }, {
          text: 'Agregar',
          handler: (res) => {

            let item: item = { name: res.name, completed: false };
            this.form.value.items.push(item);
            //this.form.controls.items.updateValueAndValidity();
            this.form.controls.items.updateValueAndValidity();
          }
        }
      ]
    })
  }


} 
