

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public email: string, public password: string) {}
}
export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: { email: string; password: string; name?: string; phoneNumber?: string }) {}
}
export class Logout {
  static readonly type = '[Auth] Logout';
}