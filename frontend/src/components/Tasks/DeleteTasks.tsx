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
import { useSelectedTasks } from "../../context/SelectedTasksContext";

interface DeleteTasksProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteTasksById = ({ isOpen, onClose }: DeleteTasksProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const { selectedTasks } = useSelectedTasks();

  const mutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      await TasksService.deleteTasks({ ids: taskIds });
    },
    onSuccess: () => {
      showToast(
        "Success",
        "All tasks were deleted successfully.",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: () => {
      showToast(
        "Error",
        "An error occurred while deleting all tasks.",
        "error"
      );
    },
  });

  const handleDelete = () => {
    mutation.mutate(selectedTasks.map((taskId) => taskId.id));
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
        <ModalHeader>Confirm Deletion task</ModalHeader>
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
          Are you sure you want to delete all tasks? This action cannot be
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

export default DeleteTasksById;
