import { User } from './models/User';

const user = new User({ id: 1, name: 'newer name', age: 999 });
// console.log(user.get('name'));

// `on` is on a getter
// so the parentheses are triggering
// the `on` function inside `Eventing` class
// NOT the one inside `User` class
user.on('save', () => {
  console.log(user);
});

user.save()