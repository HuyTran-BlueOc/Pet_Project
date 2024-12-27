// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
// } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService, TasksService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { SubmitHandler, useForm } from "react-hook-form";

interface DeleteTasksProps {
  deleteIdTasks: string[];
  isOpen: boolean;
  onClose: () => void;
}

const DeleteTasksById = ({
  isOpen,
  onClose,
  deleteIdTasks,
}: DeleteTasksProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  console.log("deleteIdTasks",deleteIdTasks)

  const mutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      await TasksService.deleteTasks({ ids: taskIds });
    },
    onSuccess: () => {
      showToast(
        "Success",
        "All categories were deleted successfully.",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: () => {
      showToast(
        "Error",
        "An error occurred while deleting all categories.",
        "error"
      );
    },
  });

  const onSubmit = async () => {
    mutation.mutate(deleteIdTasks);
  };

  return (
    // <Modal
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   size={{ base: "sm", md: "md" }}
    //   isCentered
    // >
    //   <ModalOverlay />
    //   <ModalContent>
    //     <ModalHeader>Confirm Deletion task</ModalHeader>
    //     <ModalCloseButton />
    //     <ModalBody pb={6}>
    //       Are you sure you want to delete all categories? This action cannot be
    //       undone.
    //     </ModalBody>
    //     <ModalFooter gap={3}>
    //       <Button variant="danger" onClick={handleDelete}>
    //         Delete All
    //       </Button>
    //       <Button onClick={onClose}>Cancel</Button>
    //     </ModalFooter>
    //   </ModalContent>
    // </Modal>
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>Delete tasks</AlertDialogHeader>
            <AlertDialogBody>
              {/* <p>
                All items associated with this Task will also be{" "}
                <strong>permanently deleted.</strong>
                <br />
                <strong>Title:</strong> {data.title}
                <br />
                <strong>created_at:</strong> {data.created_at}
                <br />
                <strong>Description:</strong> {data.description}
                <br />
                <strong>Due_date:</strong> {data.due_date}
                <br />
                <strong>Status:</strong> {data.status}
                <br />
                <strong>Priority:</strong> {data.priority}
              </p> */}
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Delete
              </Button>
              <Button
                ref={cancelRef}
                onClick={onClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteTasksById;
