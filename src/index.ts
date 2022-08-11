import { User } from './models/User';

const user = User.buildUser({ id: 1});
// console.log(user.get('name'));

// `on` is on a getter
// so the parentheses are triggering
// the `on` function inside `Eventing` class
// NOT the one inside `User` class
user.on('change', () => {
  console.log(user);
});

user.fetch();
