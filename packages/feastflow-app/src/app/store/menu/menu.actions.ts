import { MenuItem } from "./menu.state";

export class MenuAction {
  static readonly type = '[Menu] Add item';
  constructor(readonly payload: string) { }
}

export class GetMenuItems {
  static readonly type = '[Menu] Get items';
}

export class AddMenuItem {
  static readonly type = '[Menu] Add item';
  constructor(readonly item: MenuItem) { }
}

export class EditMenuItem {
  static readonly type = '[Menu] Edit item';
  constructor(readonly item: MenuItem) { }
}

export class DeleteMenuItem {
  static readonly type = '[Menu] Delete item';
  constructor(readonly menuId: number) { }
}

export class GetAiAllergensSuggestions {
  static readonly type = '[Menu] Get AI Allergens Suggestions';
  constructor(public payload: { ingredients: string[] }) {}
}
