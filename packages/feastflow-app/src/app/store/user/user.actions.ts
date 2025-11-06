import { User } from "./user.state";

export class UserAction {
  static readonly type = '[User] Add item';
  constructor(readonly payload: User) { }
}

export class GetUsers {
  static readonly type = '[User] Get users';
}

export class EditUser {
  static readonly type = '[User] Edit item';
  constructor(readonly item: User) { }
}

export class DeleteUser {
  static readonly type = '[User] Delete item';
  constructor(readonly userId: string) { }
}

