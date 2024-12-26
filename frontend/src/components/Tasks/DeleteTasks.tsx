import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface DeleteAllCategoriesProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAllCategories = ({ isOpen, onClose }: DeleteAllCategoriesProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  // Mutation to delete all categories
  const mutation = useMutation({
    mutationFn: async () => {
      await CategoriesService.deleteCategories(); // API call to delete all categories
    },
    onSuccess: () => {
      showToast(
        "Success",
        "All categories were deleted successfully.",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refresh categories list
      onClose(); // Close the modal
    },
    onError: () => {
      showToast(
        "Error",
        "An error occurred while deleting all categories.",
        "error"
      );
    },
  });

  const handleDelete = () => {
    mutation.mutate(); // Trigger the mutation to delete all categories
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          Are you sure you want to delete all categories? This action cannot be
          undone.
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="danger" onClick={handleDelete}>
            Delete All
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAllCategories;
