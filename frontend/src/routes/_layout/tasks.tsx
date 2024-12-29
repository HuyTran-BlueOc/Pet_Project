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
import DeleteTasksById from "../../components/Tasks/DeleteTasks";
import EditStatusTask from "../../components/Tasks/EditStatusTask";
import { PaginationFooter } from "../../components/Common/PaginationFooter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelectedTasks } from "../../context/SelectedTasksContext";
// import SearchTask from "../../components/Tasks/SearchTask";
import SearchTask from "../../components/Tasks/SearchTask";

const tasksSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/tasks")({
  component: Tasks,
  validateSearch: (search) => tasksSearchSchema.parse(search),
});

const PER_PAGE = 10;

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
  const [search, setSearch] = useState<string>("");

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const { selectedTasks, toggleTaskSelection, selectAllTasks } =
    useSelectedTasks();

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

  // const toggleTaskSelection = (task: TaskPublic) => {
  //   setSelectedTasks((prev) =>
  //     prev.includes(task) ? prev.filter((id) => id !== task) : [...prev, task]
  //   );
  // };

  return (
    <>
      <SearchTask
        search={search}
        onSearchChange={(e: any) => setSearch(e.target.value)}
      />
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>
                {/* <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(Tasks?.data || []);
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                  checked={
                    (Tasks?.data || []).length > 0 &&
                    selectedTasks.length === (Tasks?.data || []).length
                  }
                /> */}
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectAllTasks(Tasks?.data || []);
                    } else {
                      selectAllTasks([]);
                    }
                  }}
                  checked={
                    (Tasks?.data || []).length > 0 &&
                    selectedTasks.length === (Tasks?.data || []).length
                  }
                />
              </Th>
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
                  <Td>
                    {/* <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                    /> */}
                    {/* <input
                      type="checkbox"
                      checked={selectedTasks.some((t) => t.id === task.id)}
                      onChange={() => toggleTaskSelection(task)}
                    /> */}
                    <input
                      type="checkbox"
                      checked={selectedTasks.some((t) => t.id === task.id)}
                      onChange={() => toggleTaskSelection(task)}
                    />
                  </Td>
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
                    {/* {task.due_date || "N/A"} */}
                    {task?.due_date ? task.due_date.split("T")[0] : "N/A"}
                  </Td>
                  <Td
                    color={!task.due_date ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {task?.category_title || "N/A"}
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
        deleteTasksModal={DeleteTasksById}
        editStatusTasksModalAs={EditStatusTask}
      />
      <TasksTable />
    </Container>
  );
}
