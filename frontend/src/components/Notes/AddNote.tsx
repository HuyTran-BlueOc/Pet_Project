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
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, NoteCreate, NotesService, TaskPublic, TasksService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { SubmitHandler, useForm } from "react-hook-form";
import { handleError } from "../../utils";

interface AddNoteProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddNote = ({ id, isOpen, onClose }: AddNoteProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}, 
  } = useForm<NoteCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: NoteCreate) => 
      NotesService.createNote({requestBody: data}),
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

  const onSubmit: SubmitHandler<NoteCreate> = (data) => {
    console.log("data",data)
    // mutation.mutate(data)
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
          <ModalHeader>Add Note</ModalHeader>
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
  );
};

export default AddNote;
