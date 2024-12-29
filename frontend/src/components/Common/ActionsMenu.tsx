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
import ViewDetailAndEdit from "../Notes/ViewDetailAndEdit";
import { FaPlus } from "react-icons/fa";
import { BiNote } from "react-icons/bi";

interface ActionsMenuProps {
  type: string;
  value: TaskPublic | UserPublic | CategoryPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editModal = useDisclosure();
  const viewNotes = useDisclosure();
  const viewDetailModal = useDisclosure();
  const deleteModal = useDisclosure();
  const removeCategoryModal = useDisclosure();

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
            <>
              <MenuItem
                onClick={viewDetailModal.onOpen}
                icon={<FiEye fontSize="16px" />}
              >
                View detail task
              </MenuItem>
              <MenuItem
                onClick={viewNotes.onOpen}
                icon={<BiNote fontSize="16px" />}
              >
                View Notes
              </MenuItem>
            </>
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
         <ViewDetailAndEdit 
          id={value.id}
          isOpen={viewNotes.isOpen}
          onClose={viewNotes.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;
