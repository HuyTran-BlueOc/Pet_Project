import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { type ApiError, CategoriesService, CategoryCreate, type ItemCreate, ItemsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"
import React from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
interface AddCategoryProps {
  isOpen: boolean
  onClose: () => void 
}

const AddCategory = ({isOpen, onClose}: AddCategoryProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}, 
  } = useForm<CategoryCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CategoryCreate) => 
      CategoriesService.createCategory({requestBody: data}),
    onSuccess: () => {
      showToast("Success!", "Category created successfully.", "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })

  const onSubmit: SubmitHandler<CategoryCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
       <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay/>
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton/>
          <ModalBody pb={6}>
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel htmlFor="title">Tite</FormLabel>
                <Input
                  id="title"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  placeholder="Title"
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
                <Button variant="primary" type="submit" isLoading={isSubmitting}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default AddCategory
