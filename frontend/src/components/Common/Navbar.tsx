import type { ComponentType, ElementType } from "react";

import { Button, Flex, Icon, useDisclosure, InputGroup, InputLeftElement, Input, useToast} from "@chakra-ui/react";
import { FaPlus, FaSearch, FaTrash} from "react-icons/fa";

interface NavbarProps {
  type: string;
  addModalAs: ComponentType | ElementType;
  deleteModalAs:  ComponentType | ElementType;
}

const Navbar = ({ type, addModalAs, deleteModalAs}: NavbarProps) => {
  const addModal = useDisclosure();
  const AddModal = addModalAs;
  const deleteModal = useDisclosure();
  const DeleteModal = deleteModalAs

  return (
    <>
      <Flex py={8} gap={4}>
        {/* TODO: Complete search functionality */}
        <InputGroup w={{ base: "100%", md: "auto" }}>
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
        <AddModal isOpen={addModal.isOpen} onClose={addModal.onClose} />
        <DeleteModal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose} />
      </Flex>
    </>
  );
};

export default Navbar;
