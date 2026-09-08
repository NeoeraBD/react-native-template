import { types } from 'mobx-state-tree';

export const User = types.model('User', {
  email: types.string,
  name: types.string,
  role: types.string,
});

export const AuthStore = types
  .model('AuthStore', {
    isAuthenticated: types.optional(types.boolean, false),
    user: types.maybeNull(User),
    authToken: types.maybeNull(types.string),
  })
  .actions((self) => ({
    login(email: string, name: string, token: string) {
      self.isAuthenticated = true;
      self.user = User.create({ email, name, role: 'Developer' });
      self.authToken = token;
    },
    logout() {
      self.isAuthenticated = false;
      self.user = null;
      self.authToken = null;
    },
  }));
