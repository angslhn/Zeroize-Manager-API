export function username(username: string): string {
  const isLength = username.length;

  if (isLength < 3) return 'Username must be at least 3 characters';
  if (isLength > 32) return 'Username maximum 32 characters';

  const isLowercase = /[a-z]+/.test(username);
  const isUppercase = /[A-Z]+/.test(username);
  const isNumber = /\d+/.test(username);
  const isAllowedSymbol = /[_.]/.test(username);
  const isDeniedSymbol = /[^a-zA-Z0-9_.]+/.test(username);

  const dotCount = username.split('.').length;
  const underscoreCount = username.split('_').length;

  const isOverNumber = /\d{7,}/.test(username);
  const isOverDot = /[.]{2,}/.test(username);
  const isOverUnderscore = /[_]{4,}/.test(username);

  if (isDeniedSymbol) {
    if (isUppercase) return 'Capital letters and prohibited symbols are not permitted';
    if (!isAllowedSymbol || isNumber) return 'Forbidden numbers and symbols are not allowed';
    if (isAllowedSymbol) return 'Symbols are not allowed';
    return 'No prohibited symbols allowed';
  }

  if (isUppercase) return 'Containing uppercase letters is not permitted';

  if (!isLowercase) {
    if (isNumber && isAllowedSymbol) return 'Numbers and symbols are not allowed';
    if (isNumber) return 'Numbers alone are not allowed';
    if (isAllowedSymbol) return 'Symbols are not allowed';
    return 'Must contain lowercase letters';
  }

  if (isOverNumber) return 'Number cannot be more than 6';
  if (dotCount > 4) return 'The maximum dots used is 3 times.';
  if (underscoreCount > 6) return 'Maximum underscore used is 5 times';
  if (isOverDot) return 'Dots cannot be more than 1 in sequence';
  if (isOverUnderscore) return 'Underscores cannot be more than 3 in sequence';

  if (/\d/.test(username.charAt(0))) return 'Number cannot be at the beginning';
  if (username.startsWith('.') || username.endsWith('.'))
    return 'Dot cannot be at the beginning or end';

  return username;
}

export function password(value: string): string {
  const isLength = value.length;

  if (isLength < 8) return 'Password is too short, minimum 8';
  if (isLength > 64) return 'Password is too long, maximum 64';

  const isLowercase = /[a-z]+/.test(value);
  const isUppercase = /[A-Z]+/.test(value);
  const isNumber = /\d+/.test(value);
  const isSymbols = /[!@#$%^&*()_+=.?-]+/.test(value);
  const isDenied = /[^a-zA-Z0-9!@#$%^&*()_+=.?-]+/.test(value);

  if (isDenied) return 'A forbidden character was used';
  if (!isLowercase) return 'Password must contain at least one lowercase letters';
  if (!isUppercase) return 'Password must contain at least one uppercase letters';
  if (!isNumber) return 'Password must contain at least one numbers';
  if (!isSymbols) return 'Password must contain at least one symbols';

  return value;
}
