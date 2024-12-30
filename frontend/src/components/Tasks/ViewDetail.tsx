import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Spinner,
  Box,
  Text,
  Stack,
  Divider,
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
          <AlertDialogHeader textAlign="center" fontSize="lg" fontWeight="bold">
            Task Details
          </AlertDialogHeader>
          <AlertDialogBody>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Spinner size="lg" />
              </Box>
            ) : error ? (
              <Box textAlign="center" color="red.500">
                <Text>Failed to load task details. Please try again later.</Text>
              </Box>
            ) : data ? (
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="bold">Title:</Text>
                  <Text>{data.title || "N/A"}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Description:</Text>
                  <Text>{data.description || "N/A"}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Status:</Text>
                  <Text>{data.status || "N/A"}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Priority:</Text>
                  <Text>{data.priority || "N/A"}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Due Date:</Text>
                  <Text>
                    {data.due_date
                      ? new Date(data.due_date).toLocaleString()
                      : "N/A"}
                  </Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Created At:</Text>
                  <Text>
                    {data.created_at
                      ? new Date(data.created_at).toLocaleString()
                      : "N/A"}
                  </Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Updated At:</Text>
                  <Text>
                    {data.updated_at
                      ? new Date(data.updated_at).toLocaleString()
                      : "N/A"}
                  </Text>
                </Box>
              </Stack>
            ) : (
              <Box textAlign="center">
                <Text>No task details available.</Text>
              </Box>
            )}
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="center">
            <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default TaskDetail;
