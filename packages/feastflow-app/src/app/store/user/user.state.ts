import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { DeleteUser, EditUser, GetUsers, UserAction } from './user.actions';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs';

export interface User {
  userId: string;
  userName: string;
  userRole: string;
  userStatus: string;
}

export interface UserStateModel {
  items: User[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    items: []
  }
})
@Injectable()
export class UserState {

  constructor(private commonService: CommonHttpRequestService) { }

  @Selector()
  static getState(state: UserStateModel) {
    return state;
  }

  @Action(UserAction)
  add(ctx: StateContext<UserStateModel>, { payload }: UserAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }

   @Action(GetUsers)
   getUsers(ctx: StateContext<UserStateModel>) {
     return this.commonService.getDataFromAssets('user-role.json').pipe(
       tap((response: any) => {
         const users = response.userRoles || [];
         console.log(response);
         
         ctx.patchState({ items: users });
        })
      );
    }


    @Action(EditUser)
    editUser(ctx: StateContext<UserStateModel>, { item }: EditUser) {
      const state = ctx.getState();
      const items = state.items.map(i => i.userId === item.userId ? item : i);
      ctx.patchState({ items });
    }

    @Action(DeleteUser)
    deleteUser(ctx: StateContext<UserStateModel>, { userId }: DeleteUser) {
      const state = ctx.getState();
      const filteredItems = state.items.filter((item) => item?.userId !== userId);
      ctx.patchState({ items: filteredItems });
    }
}
