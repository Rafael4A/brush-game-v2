import {
  useState,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  FC,
  useMemo,
  SetStateAction,
} from "react";

type ContextValue<T> = [T, Dispatch<SetStateAction<T>>];
type ProviderProps<T> = { children: ReactNode; initialValue?: T };
type GlobalStateResult<T> = [() => ContextValue<T>, FC<ProviderProps<T>>];

export function createGlobalState<T>(initialState: T): GlobalStateResult<T> {
  const Context = createContext<ContextValue<T>>([initialState, () => {}]);

  const Provider = (props: ProviderProps<T>) => {
    const [state, setState] = useState<T>(props.initialValue ?? initialState);

    const ctxValue = useMemo(
      () => [state, setState] as ContextValue<T>,
      [state]
    );

    return (
      <Context.Provider value={ctxValue}>{props.children}</Context.Provider>
    );
  };

  return [() => useContext(Context), Provider];
}
