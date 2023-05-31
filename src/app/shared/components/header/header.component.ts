import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { UtilsService } from '../../../services/utils.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

 // @Input() title: string;

  @Input() title: string;
  @Input() backButton: string;
  @Input() isModal: boolean;
  @Input() color: string;
  @Input() centerTitle: boolean;



  darkMode: BehaviorSubject<boolean>;
  constructor(
    private themeSvc: ThemeService,
    private utilSvc: UtilsService
    ) { }

  ngOnInit() {

    this.darkMode = this.themeSvc.darkMode;
  }

  dismissModal(){
    this.utilSvc.dismissModal();
  }

  setTheme(darkMode: boolean){
    this.themeSvc.setTheme(darkMode);
  }

}
