import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import { CategoriesService, TasksService, UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface DeleteProps {
  type: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const Delete = ({ type, id, isOpen, onClose, data }: DeleteProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const deleteEntity = async (id: string) => {
    if (type === "Category") {
      await CategoriesService.deleteCategory({ id: id });
    } else if (type === "Task") {
      await TasksService.deleteTask({ id: id });
    } else if (type === "User") {
      await UsersService.deleteUser({ userId: id });
    } else {
      throw new Error(`Unexpected type: ${type}`);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      showToast(
        "Success",
        `The ${type.toLowerCase()} was deleted successfully.`,
        "success"
      );
      onClose();
    },
    onError: () => {
      showToast(
        "An error occurred.",
        `An error occurred while deleting the ${type.toLowerCase()}.`,
        "error"
      );
    },
    onSettled: () => {
      const queryKey =
        type === "Task" ? "tasks" : type === "User" ? "users" : "categories";
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  const onSubmit = async () => {
    mutation.mutate(id);
  };

  return (
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
            <AlertDialogHeader>Delete {type}</AlertDialogHeader>
            <AlertDialogBody>
              {type === "User" && (
                <p>
                  All items associated with this user will also be{" "}
                  <strong>permanently deleted.</strong>
                  <br />
                  <strong>Email:</strong> {data.email}
                  <br />
                  <strong>Full Name:</strong> {data.full_name}
                </p>
              )}
              {type === "Task" && (
                <p>
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
                </p>
              )}
              {type === "Category" && (
                <p>
                  All items associated with this Category will also be{" "}
                  <strong>permanently deleted.</strong>
                  <br />
                  <strong>Title:</strong> {data.title}
                  <br />
                  <strong>Description:</strong> {data.description}
                </p>
              )}
              {/* <p>Are you sure? You will not be able to undo this action.</p> */}
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

export default Delete;
