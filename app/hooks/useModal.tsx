import { useCallback, useState } from "react";

export const useModal = (initialVisible = false) => {
  const [isOpen, setIsOpen] = useState(initialVisible);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
