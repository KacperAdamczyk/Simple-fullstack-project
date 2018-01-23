import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IResponse, UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  invalidEmailOrPassword = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;

    this.userService.login(username, password)
      .then(() => {
        this.router.navigate(['/tasks']);
    }, (error) => {
      const payload = error.error;
      switch (payload.code) {
        case 3: /* Invalid email or password */
          this.invalidEmailOrPassword = true;
          break;
        default:
          this.router.navigate(['/error']);
          break;
      }
    });
  }

  get username() {
    return this.form.get('username') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }
}
