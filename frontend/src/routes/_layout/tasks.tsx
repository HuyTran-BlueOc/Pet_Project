import {
  Container,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Navbar from "../../components/Common/Navbar";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { TaskPublic, TasksService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import AddEditTask from "../../components/Tasks/AddEditTask";
import { PaginationFooter } from "../../components/Common/PaginationFooter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const tasksSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/tasks")({
  component: Tasks,
  validateSearch: (search) => tasksSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getTasksQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TasksService.readTasks({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["tasks", { page }],
  };
}

function TasksTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const {
    data: Tasks,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getTasksQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });
  const hasNextPage = !isPlaceholderData && Tasks?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getTasksQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Numerical Order</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
              <Th>due_date</Th>
              <Th>Category Title</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {Tasks?.data.map((task: TaskPublic, index: any) => (
                <Tr key={task.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td isTruncated maxWidth="50px">
                    {index + 1}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {task.title}
                  </Td>
                  <Td
                    color={!task.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {task.description || "N/A"}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {task.status}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {task.priority}
                  </Td>
                  <Td
                    color={!task.due_date ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {task.due_date || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Task"} value={task} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
}

export default TasksTable;

function Tasks() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Tasks Management
      </Heading>

      <Navbar
        type={"Task"}
        addModalAs={AddEditTask}
        // update_tasks_status: List[id]          --    --            --navbarPage
        // delete_tasks: List[id]                 --    --            --navbarPage
      />
      <TasksTable />
    </Container>
  );
}
