import type { ComponentType } from "react";

import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useSelectedTasks } from "../../context/SelectedTasksContext";

interface NavbarProps {
  type: string;
  addModalAs: ComponentType<any>;
  deleteModalAs?: ComponentType<any>;
  removeCategoryFromTask?: ComponentType<any>;
  search_tasks?: ComponentType<any>;
  editStatusTasksModalAs?: ComponentType<any>;
  deleteTasksModal?: ComponentType<any>;
}

const Navbar = ({
  type,
  addModalAs,
  deleteModalAs,
  deleteTasksModal,
  editStatusTasksModalAs,
}: NavbarProps) => {
  const addModal = useDisclosure();
  const AddModal = addModalAs;
  const deleteModal = useDisclosure();
  const editStatusModal = useDisclosure();
  const DeleteModal = deleteModalAs;
  const DeleteTasksModal = deleteTasksModal;
  const EditStatusTasksModal = editStatusTasksModalAs;
  const { selectedTasks } = useSelectedTasks();
  console.log("selectedTasks", selectedTasks.length);

  function showToast(arg0: string, arg1: string, arg2: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Flex py={8} gap={4} justifyContent="space-between" alignItems="center">
        {/* Actions Section */}
        <Flex gap={4}>
          <Button
            variant="primary"
            gap={1}
            fontSize={{ base: "sm", md: "inherit" }}
            onClick={addModal.onOpen}
          >
            <Icon as={FaPlus} /> Add {type}
          </Button>
          {type === "Category" && (
            <Button
              variant="outline"
              colorScheme="red"
              gap={1}
              fontSize={{ base: "sm", md: "inherit" }}
              onClick={deleteModal.onOpen}
            >
              <Icon as={FaTrash} /> Delete All
            </Button>
          )}

          {type === "Task" && (
            <>
              {/* <Button
                variant="outline"
                colorScheme="red"
                gap={1}
                fontSize={{ base: "sm", md: "inherit" }}
                onClick={deleteModal.onOpen}
              >
                <Icon as={FaTrash} /> Delete selected task
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                gap={1}
                fontSize={{ base: "sm", md: "inherit" }}
                onClick={editStatusModal.onOpen}
              >
                <Icon as={FiEdit} /> UPdate status selected task
              </Button> */}
              <Button
                variant="outline"
                colorScheme={selectedTasks.length > 0 ? "red" : "gray"}
                isDisabled={selectedTasks.length === 0}
                onClick={() => {
                  if (selectedTasks.length === 0) {
                    // Show an alert or toast if no tasks are selected
                    showToast(
                      "Error",
                      "Please select at least one task before deleting.",
                      "error"
                    );
                  } else {
                    deleteModal.onOpen();
                  }
                }}
              >
                Delete Selected Tasks
              </Button>

              <Button
                variant="solid"
                colorScheme={selectedTasks.length > 0 ? "blue" : "gray"}
                isDisabled={selectedTasks.length === 0}
                onClick={() => {
                  if (selectedTasks.length === 0) {
                    // Show an alert or toast if no tasks are selected
                    showToast(
                      "Error",
                      "Please select at least one task before editing status.",
                      "error"
                    );
                  } else {
                    editStatusModal.onOpen();
                  }
                }}
              >
                Edit Status
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <AddModal isOpen={addModal.isOpen} onClose={addModal.onClose} />

      {type === "Category" && DeleteModal && (
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      )}

      {type === "Task" && (
        <>
          {/* DeleteTasksModal */}
          {DeleteTasksModal && (
            <DeleteTasksModal
              isOpen={deleteModal.isOpen}
              onClose={deleteModal.onClose}
            />
          )}

          {/* EditStatusTasksModal */}
          {EditStatusTasksModal && (
            <EditStatusTasksModal
              isOpen={editStatusModal.isOpen}
              onClose={editStatusModal.onClose}
            />
          )}
        </>
      )}
    </>
  );
};

export default Navbar;
