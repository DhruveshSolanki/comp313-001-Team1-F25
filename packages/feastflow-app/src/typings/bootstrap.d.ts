declare module 'bootstrap' {
  export class Toast {
    constructor(element: Element, options?: { delay?: number; autohide?: boolean; animation?: boolean });
    show(): void;
    hide(): void;
    dispose(): void;
  }
}
