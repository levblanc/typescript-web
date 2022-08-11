import { Eventing } from './Eventing';
import axios, { AxiosResponse } from 'axios';

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(public rootUrl: string, public deserialize: (json: K) => T) {}

  on = this.events.on;

  trigger = this.events.trigger;

  fetch(): void {
    axios.get(this.rootUrl).then((res: AxiosResponse) => {
      res.data.forEach((value: K) => {
        this.models.push(this.deserialize(value));
      });

      this.trigger('change');
    });
  }
}
