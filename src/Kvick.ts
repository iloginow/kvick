import Component from './Component';

export default class Kvick {
  Component: typeof Component;

  constructor() {
    this.Component = Component;
    console.log('Hello from Kvick');
  }

  hello(): string {
    return 'Hello from Kvick';
  }
}
