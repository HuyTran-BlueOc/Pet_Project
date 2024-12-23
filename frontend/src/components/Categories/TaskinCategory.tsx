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
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ItemsService } from "../../client";
import React from "react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
  categoryTitle: string | null;
}

const ItemModal = ({
  isOpen,
  onClose,
  categoryId,
  categoryTitle,
}: ItemModalProps) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", { categoryId }],
    // queryFn: () => (categoryId ? ItemsService.getTasksByCategoryId(categoryId) : []),
    enabled: !!categoryId, // Only fetch if categoryId exists
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tasks for {categoryTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          >
          {isLoading ? (
            <>
              <Spinner size="lg" mb={2} />
              <p>No Task</p>
            </>
          ) : (
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Task Name</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* {tasks?.map((task) => (
                  <Tr key={task.id}>
                    <Td>{task.name}</Td>
                    <Td>{task.status}</Td>
                  </Tr>
                ))} */}
                <Tr>
                  <Td>Name</Td>
                  <Td>Description 1</Td>
                  <Td>Status</Td>
                </Tr>
              </Tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;
