
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ETaskStatus, TasksService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { useSelectedTasks } from "../../context/SelectedTasksContext";

interface EditStatusTasksProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditStatusTask = ({ isOpen, onClose }: EditStatusTasksProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const { selectedTasks } = useSelectedTasks();

  const [selectedStatus, setSelectedStatus] = useState<ETaskStatus>(
    ETaskStatus.PENDING // Default status
  );

  const mutation = useMutation({
    mutationFn: async ({
      taskIds,
      status,
    }: {
      taskIds: string[];
      status: ETaskStatus;
    }) => {
      await TasksService.updateStatusTasks({
        ids: taskIds,
        status: status, // Provide the desired status
      });
    },
    onSuccess: () => {
      showToast("Success", "Task statuses updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: () => {
      showToast("Error", "An error occurred while updating statuses.", "error");
    },
  });

  const handleUpdateStatus = () => {
    mutation.mutate({
      taskIds: selectedTasks.map((task) => task.id), // Extract IDs from selected tasks
      status: selectedStatus,
    });
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
        <ModalHeader>Update Task Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <p>Select a new status for the selected tasks:</p>
          <Select
            mt={4}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ETaskStatus)}
          >
            {Object.values(ETaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStatusTask;
