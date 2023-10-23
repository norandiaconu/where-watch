export class AddLogin {
  static readonly type = '[Login] Add';

  constructor(public newLogin: string) {}
}
