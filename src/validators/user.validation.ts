import ResponseError from '@/helpers/response-error.js';
import * as InputValidation from '@/validators/inputs/user.input.js';

import type { Validation } from '@/@types/globals.js';

export function login(data: Validation) {
  const username = data.username.trim();

  if (!username || !data.password.trim()) {
    throw new ResponseError(
      400,
      'Login Failed',
      'Username and password must be filled in for the login process.',
    );
  }

  const usernameChecked = InputValidation.username(username);

  if (username !== usernameChecked) {
    throw new ResponseError(
      400,
      'Invalid Username Format',
      'Make sure your username is the same as when you registered to continue logging in.',
    );
  }
}

export function register(data: Validation) {
  const username = data.username.trim();
  const password = data.password.trim();

  const usernameChecked = InputValidation.username(username);
  const passwordChecked = InputValidation.password(password);

  if (username !== usernameChecked) {
    throw new ResponseError(400, 'Invalid Username', usernameChecked);
  }

  if (password !== passwordChecked) {
    throw new ResponseError(400, 'Insecure Password', passwordChecked);
  }
}

export function deleteAccount(data: Validation) {
  if (typeof data.password !== 'string' || data.password.length < 8) {
    throw new ResponseError(
      400,
      'Confirm Password Invalid',
      'The password used to confirm deletion is incorrect, please check and confirm again.',
    );
  }
}

export function changePassword(data: Validation) {
  if (typeof data.oldPassword !== 'string' || data.oldPassword.length < 8) {
    throw new ResponseError(
      400,
      'Old Password Invalid',
      'The old password used to change password is incorrect, please check and confirm again.',
    );
  }

  const passwordChecked = InputValidation.password(data.newPassword);

  if (data.newPassword !== passwordChecked) {
    throw new ResponseError(400, 'Insecure Password', passwordChecked);
  }
}
