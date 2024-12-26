import React, { useEffect, useState } from "react";
import { CategoriesService, CategoryPublic } from "../../client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Box,
} from "@chakra-ui/react";

type CategoryTasksModalProps = {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const CategoryTasks = ({
  categoryId,
  isOpen,
  onClose,
}: CategoryTasksModalProps) => {
  const [category, setCategory] = useState<CategoryPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return; // If no category ID, skip the API request
      try {
        const response = await CategoriesService.Categoryreadtask({ id: categoryId });
        setCategory(response); // Assuming the response is CategoryPublic, which has tasksData
      } catch (err: any) {
        // Log the full error to check for more details
        console.error("Error fetching category:", err);
        setError("Failed to fetch category data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategory();
  }, [categoryId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tasks for Category: {category?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Spinner size="xl" />
            </Box>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {category && category.tasksData && category.tasksData.length > 0 ? (
                <ul>
                  {category.tasksData.map((task) => (
                    <li key={task.id}>
                      {task.title} - {task.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No tasks available.</div>
              )}
            </>
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
