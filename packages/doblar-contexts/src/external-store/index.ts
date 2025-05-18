import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { isEqualShallow } from 'utils/is-equal-shallow';
import { isFunction } from 'utils/is-function';

type ListenFn<S> = (value: S) => void;
type InitializeFn<S> = () => S | Promise<S>;
type UpdateFn<S> = (draft: S) => S;

class ReactExternalStore<S> {
  listeners: ListenFn<S>[];
  isInitialized: boolean = false;
  currentValue: S;
  initializeFn?: InitializeFn<S>;
  isEqual: <Selection>(a: Selection, b: Selection) => boolean;
  constructor(
    defaultValue: S,
    initializeFn?: InitializeFn<S>,
    isEqual: <Selection>(
      a: Selection,
      b: Selection,
    ) => boolean = isEqualShallow,
  ) {
    this.listeners = [];
    this.currentValue = defaultValue;
    this.initializeFn = initializeFn;
    this.isEqual = isEqual;
    this.initialize();
  }
  private initialize = async () => {
    if (this.initializeFn && !this.isInitialized) {
      const value = await this.initializeFn();

      if (value !== undefined) {
        this.update(value);
      }

      this.isInitialized = true;
    }
  };
  subscribe = (listener: ListenFn<S>) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  };
  getSnapshot = () => {
    return this.currentValue;
  };
  getServerSnapshot = () => {
    return this.currentValue;
  };
  update = (value: S | UpdateFn<S>) => {
    const nextValue = isFunction(value) ? value(this.currentValue) : value;
    if (this.isEqual(this.currentValue, nextValue)) {
      return;
    }

    this.currentValue = nextValue;
    this.listeners.forEach(fn => {
      fn(nextValue);
    });
  };
}

export const createExternalContainer = <S>(
  initialValue: S,
  syncInitializeFn?: InitializeFn<S>,
  isEqual: <Selection>(a: Selection, b: Selection) => boolean = isEqualShallow,
) => {
  const externalStore = new ReactExternalStore(
    initialValue,
    syncInitializeFn,
    isEqual,
  );
  const useExternalStore = <Selection = S>(
    store: ReactExternalStore<S>,
    selector: (value: S) => Selection = value => value as unknown as Selection,
  ) => {
    return useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getSnapshot,
      store.getServerSnapshot,
      selector,
      (a: Selection, b: Selection) => store.isEqual(a, b),
    );
  };

  return [useExternalStore, externalStore] as const;
};

export type { ReactExternalStore };
