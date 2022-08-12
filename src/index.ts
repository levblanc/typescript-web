import { User } from './models/User';
import { UserList } from './views/UserList';

const users = User.buildUserCollection();
const root = document.getElementById('root');

users.on('change', () => {
  if (root) {
    new UserList(root, users).render();
  } else {
    throw new Error('Root element not found!');
  }
});

users.fetch();