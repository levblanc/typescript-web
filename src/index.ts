import { User } from './models/User';

const user = new User({ name: 'new record', age: 0 });

user.save();

user.events.on('change', () => {
  console.log('changed!');
});

user.events.trigger('change');
