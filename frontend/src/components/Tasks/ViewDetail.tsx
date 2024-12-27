import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskPublic, TasksService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface TaskDetailProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetail = ({ id, isOpen, onClose }: TaskDetailProps) => {
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const { data, isLoading, error } = useQuery<TaskPublic, Error>({
    queryKey: ["tasks", id],
    queryFn: async () => {
      try {
        return await TasksService.readTask({ id });
      } catch (err) {
        showToast(
          "Error",
          "Failed to load task details. Please try again later.",
          "error"
        );
        throw err; // Rethrow để React Query có thể xử lý lỗi
      }
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Task Details</AlertDialogHeader>
          <AlertDialogBody>
            {isLoading ? (
              <Spinner size="lg" />
            ) : error ? (
              <p>Failed to load task details. Please try again later.</p>
            ) : data ? (
              <div>
                <p>
                  <strong>Title:</strong> {data.title}
                </p>
                <p>
                  <strong>Description:</strong> {data.description || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {data.status}
                </p>
                <p>
                  <strong>Priority:</strong> {data.priority}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {data.due_date
                    ? new Date(data.due_date).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {data.created_at
                    ? new Date(data.created_at).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {data.updated_at
                    ? new Date(data.updated_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ) : (
              <p>No task details available.</p>
            )}
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default TaskDetail;
