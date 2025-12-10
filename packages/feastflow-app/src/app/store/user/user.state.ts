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
  staffEmail?: string;
  staffPhoneNumber?: string;
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
     return this.commonService.getStaff().pipe(
       tap((response: any) => {
         const users = (Array.isArray(response) ? response : [])
          .map((s: any, idx: number) => ({
            userId: s.staffId,
            userName: s.staffName,
            userRole: s.role,
            userStatus: s.status,
            staffEmail: s.staffEmail,
            staffPhoneNumber: s.staffPhoneNumber,
            // displayId will be generated in UI via pipe/helper
          }));
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
