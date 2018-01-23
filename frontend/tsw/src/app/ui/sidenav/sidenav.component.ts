import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../../services/user.service';

interface IOption {
  name: string;
  path: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.scss' ],
  providers: [ MediaMatcher ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  options: IOption[] = [
    { name: 'Lista zadań', path: '/tasks' },
    { name: 'Dodaj zadanie', path: '/task' },
  ];

  optionsNotLogged: IOption[] = [
    { name: 'Zaloguj', path: '/login' },
    { name: 'Utwórz konto', path: '/register' },
  ];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private userService: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggle() {
    this.sidenav.toggle();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  logOut() {
    this.userService.logOut();
  }
}
