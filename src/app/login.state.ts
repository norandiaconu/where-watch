import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddLogin } from "./login.actions";

export interface LoginStateModel {
  login: string;
}

@State<LoginStateModel>({
  name: 'login',
  defaults: {
    login: "",
  }
})
export class LoginState {
  @Selector()
  static getLogin(state: LoginStateModel): string {
    return state.login;
  }

  @Action(AddLogin)
  addLogin({patchState}: StateContext<LoginStateModel>, {newLogin}: AddLogin): void {
    patchState({login: newLogin});
  }
}
