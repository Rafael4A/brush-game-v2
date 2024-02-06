import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  useContext,
} from "react";

import { BaseModalProps, BaseModal } from "./BaseModal";

interface ConfirmModalOptions
  extends Omit<BaseModalProps, "open" | "onClose" | "children"> {
  content: (id: string) => ReactNode;
  onClose?: () => void;
}

export interface ConfirmModalContextOptions {
  confirm: (options: ConfirmModalOptions) => void;
  dismiss: () => void;
}

interface ConfirmModalProviderProps {
  children: ReactNode;
}

const ConfirmModalContext = createContext<ConfirmModalContextOptions>(
  {} as ConfirmModalContextOptions
);

export function ConfirmModalProvider({
  children,
}: Readonly<ConfirmModalProviderProps>) {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const confirm = useCallback((modalOptions: ConfirmModalOptions) => {
    setOptions(modalOptions);
    setOpen(true);
  }, []);

  const [options, setOptions] = useState<ConfirmModalOptions | undefined>();

  const descriptionId = "confirm-dialog-description";

  const contextValue = useMemo(
    () => ({ dismiss, confirm }),
    [dismiss, confirm]
  );

  return (
    <ConfirmModalContext.Provider value={contextValue}>
      {children}

      {!!options && (
        <BaseModal
          open={open}
          aria-describedby={descriptionId}
          onClose={() => {
            dismiss();
            options?.onClose?.();
          }}
          actions={options.actions}
          title={options.title}
          id={options.id}
        >
          {options.content(descriptionId)}
        </BaseModal>
      )}
    </ConfirmModalContext.Provider>
  );
}

export function useConfirmModal(): ConfirmModalContextOptions {
  return useContext(ConfirmModalContext);
}
