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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TasksService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface DeleteTasksProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const RemoveCatrgoryFromTask = ({ isOpen, onClose, id }: DeleteTasksProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  // const { selectedTasks } = useSelectedTasks();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await TasksService.removeCategoryfromTask({ id: id });
    },
    onSuccess: () => {
      showToast(
        "Success",
        "All categories were deleted successfully.",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
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
    mutation.mutate(id);
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
        <ModalHeader>Confirm remove category form task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* <p>
            All items associated with this Task will also be{" "}
            <strong>permanently deleted.</strong>
            <br />
            <strong>Title:</strong> {data.title}
            <br />
            <strong>created_at:</strong> {data.created_at}
            <br />
            <strong>Description:</strong> {data.description}
            <br />
            <strong>Due_date:</strong> {data.due_date}
            <br />
            <strong>Status:</strong> {data.status}
            <br />
            <strong>Priority:</strong> {data.priority}
          </p> */}
         Are you sure you want to remove the category from the task? This action cannot be undone.
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="danger" onClick={handleDelete}>
            remove category
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveCatrgoryFromTask;
