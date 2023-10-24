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

export function createGlobalStorageState<T>(
  key: string,
  initialState: T
): GlobalStateResult<T> {
  const Context = createContext<ContextValue<T>>([initialState, () => {}]);

  const Provider = (props: ProviderProps<T>) => {
    const [state, setState] = useState<T>(
      JSON.parse(localStorage.getItem(key) ?? "null") ??
        props.initialValue ??
        initialState
    );

    const ctxValue = useMemo(
      () =>
        [
          state,
          (newState: SetStateAction<T>) => {
            if (determineIfIsSetStateFunction(newState)) {
              setState((prev) => {
                const newValue = newState(prev);
                localStorage.setItem(key, JSON.stringify(newValue));
                return newValue;
              });
            } else {
              setState(newState);
              localStorage.setItem(key, JSON.stringify(newState));
            }
          },
        ] as ContextValue<T>,
      [state]
    );

    return (
      <Context.Provider value={ctxValue}>{props.children}</Context.Provider>
    );
  };

  return [() => useContext(Context), Provider];
}

function determineIfIsSetStateFunction<T>(
  newState: SetStateAction<T>
): newState is (prevState: T) => T {
  return typeof newState === "function";
}
