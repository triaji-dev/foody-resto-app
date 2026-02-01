import { useState } from 'react';

interface UseCartInteractionsProps {
  updateItem: (params: { id: number; quantity: number }) => void;
  deleteItem: (id: number, options?: { onSuccess?: () => void }) => void;
}

export function useCartInteractions({
  updateItem,
  deleteItem,
}: UseCartInteractionsProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateQuantity = (
    id: number,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      confirmDelete(id);
    } else {
      updateItem({ id, quantity: newQuantity });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        },
      });
    }
  };

  return {
    deleteId,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    confirmDelete,
    handleUpdateQuantity,
    handleConfirmDelete,
  };
}
