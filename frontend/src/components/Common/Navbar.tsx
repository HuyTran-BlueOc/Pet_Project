import type { ComponentType, ElementType } from "react";

import {
  Button,
  Flex,
  Icon,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";

interface NavbarProps {
  type: string;
  addModalAs: ComponentType<any>;
  deleteModalAs?: ComponentType<any>;
  removeCategoryFromTask?: ComponentType<any>;
  search_tasks?: ComponentType<any>;
  updateTasksStatus?: ComponentType<any>;
  deleteTasks?: ComponentType<any>;
}

//actions tasks
// get_tasks_by_owner                     --done--            --homeTaskPage
// get_task                               --done--            --homeTaskPage : map[id] (view) display model show infomation task_id
// update_task                            --done / --         --homeTaskPage : map[id]
// delete_task                            --done--            --homeTaskPage : map[id]
// remove_category_from_task:{id}         --    --            --homeTaskPage : map[id]

// ======================================================================

// create_task                            --done / --         --navbarPage
// update_tasks_status: List[id]          --    --            --navbarPage
// delete_tasks: List[id]                 --    --            --navbarPage
// search_tasks                           --    --            --navbarPage

const Navbar = ({ type, addModalAs, deleteModalAs }: NavbarProps) => {
  const addModal = useDisclosure();
  const AddModal = addModalAs;
  const deleteModal = useDisclosure();
  const DeleteModal = deleteModalAs;

  return (
    <>
      <Flex py={8} gap={4} justifyContent="space-between" alignItems="center">
        <InputGroup w={{ base: "100%", md: "auto" }}>
          {/* Search and filter Section */}
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="ui.dim" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search"
            fontSize={{ base: "sm", md: "inherit" }}
            borderRadius="8px"
          />
        </InputGroup>

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
          <Button
            variant="outline"
            colorScheme="red"
            gap={1}
            fontSize={{ base: "sm", md: "inherit" }}
            onClick={deleteModal.onOpen}
          >
            <Icon as={FaTrash} /> Delete All
          </Button>
        </Flex>
      </Flex>
      <AddModal isOpen={addModal.isOpen} onClose={addModal.onClose} />
      {/* <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        /> */}
      {DeleteModal && (
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      )}
    </>
  );
};

export default Navbar;
