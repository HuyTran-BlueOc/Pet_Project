import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";

import type { CategoryPublic, TaskPublic, UserPublic } from "../../client";
import EditUser from "../Admin/EditUser";
import EditCategory from "../Categories/EditCategory";
import Delete from "./DeleteAlert";
import AddEditTask from "../Tasks/AddEditTask";
import ViewDetail from "../Tasks/ViewDetail";
import AddNote from "../Notes/AddNote";
import ViewAllNote from "../Notes/ViewAllNote";
import { FaPlus } from "react-icons/fa";

interface ActionsMenuProps {
  type: string;
  value: TaskPublic | UserPublic | CategoryPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editModal = useDisclosure();
  const viewDetailModal = useDisclosure();
  const addNoteModal = useDisclosure();
  const deleteModal = useDisclosure();
  const ViewAllNoteModal = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          {type == "Task" && (
            <MenuItem
              onClick={viewDetailModal.onOpen}
              icon={<FiEye  fontSize="16px" />}
            >
              View detail task
            </MenuItem>
          )}
          {type == "Task" && (
            <MenuItem
              onClick={ViewAllNoteModal.onOpen}
              icon={<FiEye  fontSize="16px" />}
            >
              View All Note
            </MenuItem>
          )}
          {type == "Task" && (
            <MenuItem
              onClick={addNoteModal.onOpen}
              icon={<FaPlus  fontSize="16px" />}
            >
              Add Note
            </MenuItem>
          )}
          <MenuItem
            onClick={editModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : type === "Task" ? (
          <AddEditTask
            task={value as TaskPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : type === "Category" ? (
          <EditCategory
            category={value as CategoryPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : null}
        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
          data={value}
        />
        <ViewDetail
          id={value.id}
          isOpen={viewDetailModal.isOpen}
          onClose={viewDetailModal.onClose}
        />
        <AddNote
          id={value.id}
          isOpen={addNoteModal.isOpen}
          onClose={addNoteModal.onClose}
        />
        <ViewAllNote
          id={value.id}
          isOpen={addNoteModal.isOpen}
          onClose={addNoteModal.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;
