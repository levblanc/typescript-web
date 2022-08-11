import { AxiosPromise, AxiosResponse } from 'axios';

interface ModelAttributes<T> {
  get<K extends keyof T>(key: K): T[K];
  getAll(): T;
  set(update: T): void;
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  // Previously in User class 
  // (check git diff on commit 70d9a73e64ecb9f3b7b8e3f7f2f281e5dc6c1adb)
  // `attributes` was init inside class constructor
  //  constructor(attrs: UserProps) {
  //   this.attributes = new Attributes<UserProps>(attrs);
  // }
  // when converted to JS, method assignments will come 
  // before constructor initializations 
  // and thus throw error when refering to `this.attributes` like following:
  // get = this.attributes.get;

  // get on() {
  //   return this.events.on;
  // }
  on = this.events.on;

  // get trigger() {
  //   return this.events.trigger;
  // }
  trigger = this.events.trigger;

  // get get() {
  //   return this.attributes.get;
  // }
  get = this.attributes.get;

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger('change');
  }

  fetch(): void {
    const id = this.get('id');

    if (typeof id !== 'number') {
      throw new Error('Cannot fetch without an id.');
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  }

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((response: AxiosResponse): void => {
        this.events.trigger('save');
      })
      .catch(() => {
        this.trigger('error');
      });
  }
}