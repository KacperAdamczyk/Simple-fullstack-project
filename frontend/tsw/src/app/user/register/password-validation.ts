import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(ac: AbstractControl) {
    const password = ac.get('password');
    const confirmPassword = ac.get('confirmPassword');
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}
