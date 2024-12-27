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
  Select,
} from "@chakra-ui/react";
import {
  ApiError,
  CategoriesService,
  ETaskPriority,
  ETaskStatus,
  TaskInit,
  TaskPublic,
} from "../../client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { TasksService } from "../../client/sdk_gen/tasks.gen";

interface AddEditTaskProps {
  task?: TaskPublic;
  isOpen: boolean;
  onClose: () => void;
}

function useAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.readCategories({ skip: 0, limit: 100 }),
  });
}

function AddEditTask(props: AddEditTaskProps) {
  const { isOpen, onClose, task } = props;
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const { data: categories, isLoading, error } = useAllCategories();

  console.log("categoriesall",categories)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TaskInit>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: task || {
      title: "",
      description: "",
      status: ETaskStatus.PENDING,
      priority: ETaskPriority.MEDIUM,
      due_date: "",
      categories_id: uuidv4(),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TaskInit) => {
      if (task?.id) {
        return TasksService.updateTask({
          id: task.id,
          requestBody: data,
        });
      } else {
        return TasksService.createTask({ requestBody: data });
      }
    },
  
    onSuccess: () => {
      task?.id
        ? showToast("Success!", "Task updated successfully.", "success")
        : showToast("Success!", "Task created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  

  const onSubmit: SubmitHandler<TaskInit> = (data) => {
    const taskData = { ...data };
    console.log("taskData", taskData);
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{task ? "Edit Task" : "Add Task"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired isInvalid={!!errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter task title"
              type="text"
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              {...register("description")}
              placeholder="Enter task description"
              type="text"
            />
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.status} mt={4}>
            <FormLabel htmlFor="status">Status</FormLabel>
            <Select
              id="status"
              {...register("status", { required: "Status is required" })}
            >
              {Object.values(ETaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.priority} mt={4}>
            <FormLabel htmlFor="priority">Priority</FormLabel>
            <Select
              id="priority"
              {...register("priority", { required: "Priority is required" })}
            >
              {Object.values(ETaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.priority?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel htmlFor="due_date">Due Date</FormLabel>
            <Input
              id="due_date"
              {...register("due_date")}
              placeholder="Enter due date"
              type="date"
            />
          </FormControl>

          {/* <FormControl mt={4}>
            <FormLabel htmlFor="categories_title">Category ID</FormLabel>
            <Select
              id="categories_id"
              {...register("categories_id")}
            >
              {Object.values(ETaskPriority).map((cattegory) => (
                <option key={cattegory.id} value={cattegory.title}>
                  {cattegory.title}
                </option>
              ))}
            </Select>
          </FormControl> */}
          <FormControl mt={4}>
        <FormLabel htmlFor="categories_id">Category ID</FormLabel>
        <Select
          id="categories_id"
          placeholder="Select category"
          {...register("categories_id")}
          isDisabled={isLoading}
        >
          {isLoading ? (
            <option>Loading...</option>
          ) : (
            categories?.data.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))
          )}
        </Select>
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
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddEditTask;
