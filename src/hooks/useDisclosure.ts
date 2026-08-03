"use client";

import * as React from "react";

interface UseDisclosureOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { defaultOpen = false, onOpen, onClose } = options;

  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);

  const open = React.useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        onClose?.();
      } else {
        onOpen?.();
      }
      return !prev;
    });
  }, [onOpen, onClose]);

  return { isOpen, open, close, toggle };
}