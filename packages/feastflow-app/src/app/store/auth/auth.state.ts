import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { Login, Logout, Register } from './auth.action';

export interface AuthStateModel {
  token: string | null;
  refreshToken: string | null;
  role: string | null;
  loading: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    refreshToken: null,
    role: null,
    loading: false,
  }
})
@Injectable()
export class AuthState {
  constructor(private auth: AuthService) {}

  @Selector()
  static token(state: AuthStateModel) { return state.token; }
  @Selector()
  static role(state: AuthStateModel) { return state.role; }
  @Selector()
  static isLoggedIn(state: AuthStateModel) { return !!state.token; }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { email, password }: Login) {
    ctx.patchState({ loading: true });
    return this.auth.login({ email, password }).pipe(
      tap((res: any) => {
        ctx.patchState({
          token: String(res.token || this.auth.getAccessToken() || ''),
          refreshToken: String(res.refreshToken || this.auth.getRefreshToken() || ''),
          role: String(res.role || this.auth.getRole() || '').toUpperCase(),
          loading: false,
        });
      })
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, { payload }: Register) {
    ctx.patchState({ loading: true });
    return this.auth.register(payload).pipe(
      tap(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.auth.logout();
    ctx.setState({ token: null, refreshToken: null, role: null, loading: false });
  }
}
