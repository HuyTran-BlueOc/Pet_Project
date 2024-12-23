import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApiError,
  type CategoryPublic,
  type CategoryUpdate,
  CategoriesService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import React from "react";
import { handleError } from "../../utils";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button
} from "@chakra-ui/react";
interface EditCategoryProps {
  category: CategoryPublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditCategory = ({ category, isOpen, onClose }: EditCategoryProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<CategoryUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: category,
  });
  const mutation = useMutation({
    mutationFn: (data: CategoryUpdate) =>
      CategoriesService.updateCategory({ id: category.id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "category updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const onSubmit: SubmitHandler<CategoryUpdate> = async (data) => {
    mutation.mutate(data);
  };
  const onCancel = () => {
    reset();
    onClose();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                })}
                type="text"
              />
              {errors.title && (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                {...register("description")}
                placeholder="Description"
                type="text"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCategory;
