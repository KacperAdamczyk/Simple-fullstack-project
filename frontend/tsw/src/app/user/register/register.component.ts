import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IResponse, UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { PasswordValidation } from './password-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  usernameTaken = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
        username: [ '', Validators.required ],
        password: [ '', Validators.required ],
        confirmPassword: [ '', Validators.required ]
      },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  submit() {
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;

    this.userService.register(username, password)
      .then(() => {
        this.router.navigate([ '/tasks' ]);
      }, (error) => {
        const payload = error.error;
        switch (payload.code) {
          case 4: /* Username already taken */
            this.usernameTaken = true;
            break;
          default:
            this.router.navigate([ '/error' ]);
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

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }
}
