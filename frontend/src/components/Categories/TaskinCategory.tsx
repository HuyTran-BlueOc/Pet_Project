import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { TasksService } from "../../client";

type CategoryTasksModalProps = {
  taskid: string | null;
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const CategoryTasks = ({
  categoryId,
  isOpen,
  onClose,
}: CategoryTasksModalProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", categoryId],
    queryFn: () => TasksService.readTasks({ skip: 0, limit: 100 }),

    enabled: !!categoryId, // Only run the query if categoryId exists
  });

  // Filter tasks by the given categoryId
  const filteredTasks = tasks?.data.filter((task) =>
    task?.categories_id?.includes(categoryId ?? "")
  );

  // Format due_date to display only the date (MM/DD/YYYY)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "N/A"; // Fallback if date is undefined
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  // Function to color status based on the value
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "red.500"; // Red for pending
      case "In_progress":
        return "yellow.500"; // Yellow for in progress
      case "Completed":
        return "green.500"; // Green for completed
      case "Cancelled":
        return "gray.500"; // Gray for cancelled
      default:
        return "while"; // Default black color if status is unknown
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="80vw" width="auto">
        {/* Adjust width by changing maxW to control modal width */}
        <ModalHeader>Tasks for Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Spinner size="xl" />
            </Box>
          ) : error ? (
            <Box color="red.500">{`Error: ${error}`}</Box>
          ) : filteredTasks && filteredTasks.length > 0 ? (
            <TableContainer>
              <Table variant="simple" width="100%">
                <Thead>
                  <Tr>
                    <Th>Task Title</Th>
                    <Th>Description</Th>
                    <Th>Priority</Th>
                    <Th>Status</Th>
                    <Th>Due Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTasks.map((task) => (
                    <Tr key={task.id}>
                      <Td>{task.title}</Td>
                      <Td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                        {task.description || "N/A"}
                      </Td>
                      <Td>{task.priority}</Td>
                      <Td color={getStatusColor(task.status)}>
                        {task.status}
                      </Td>
                      <Td>{formatDate(task.due_date)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Box>No tasks available for this category.</Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryTasks;
