import {
  Box,
  Container,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { CategoriesService, ETaskStatus, TasksService } from "../../client";
import { createFileRoute } from "@tanstack/react-router";
import useAuth from "../../hooks/useAuth";

const PER_PAGE = 5;

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

// Lấy danh sách category từ API
function getCategoriesQueryOptions() {
  return {
    queryFn: () =>
      CategoriesService.readCategories({
        skip: 0, // Start from the first page (skip = 0)
        limit: PER_PAGE, // Limit the number of categories per page
      }),
    queryKey: ["categories"], // Unique key for the query
  };
}

// // Lấy danh sách tasks từ API
// function getTasksQueryOptions() {
//   return {
//     queryFn: () =>
//       TasksService.readTasks({
//         skip: 0, // Start from the first page (skip = 0)
//         limit: PER_PAGE, // Limit the number of tasks per page
//       }),
//     queryKey: ["tasks"], // Unique key for the query
//   };
// }

function Dashboard() {
  const { user: currentUser } = useAuth(); // Giả sử bạn đang sử dụng hook này để lấy thông tin người dùng.

  // Fetch categories và total count
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    ...getCategoriesQueryOptions(),
  });

  // Fetch tasks và total count
  // const {
  //   data: tasks,
  //   isLoading: tasksLoading,
  //   isError: tasksError,
  // } = useQuery({
  //   ...getTasksQueryOptions(),
  // });

  // Hiển thị loading hoặc lỗi
  if (categoriesLoading ) {
    return <Spinner size="xl" />;
  }

  if (categoriesError) {
    return (
      <Text color="red.500">
        There was an error loading categories or tasks
      </Text>
    );
  }

  // Lấy tổng số category từ dữ liệu trả về từ API
  const totalCategories = categories?.count || 0; // Dữ liệu trả về có trường 'count'

  // Lấy tổng số task từ dữ liệu trả về từ API
  // const totalTasks = tasks?.count || 0;
  // const completedTasks =
  //   tasks?.data.filter((task) => task.status === ETaskStatus.COMPLETED)
  //     .length || 0;
  // const pendingTasks =
  //   tasks?.data.filter((task) => task.status === ETaskStatus.PENDING).length ||
  //   0;
  // const inProgressTasks =
  //   tasks?.data.filter((task) => task.status === ETaskStatus.IN_PROGRESS)
  //     .length || 0;
  // const cancelledTasks =
  //   tasks?.data.filter((task) => task.status === ETaskStatus.CANCELLED)
  //     .length || 0;

  return (
    <Container maxW="full" p={0} h="100vh">
      <Box pt={12} m={4} h="100%" display="flex" flexDirection="column">
        <Text fontSize="3xl" fontWeight="bold">
          Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        <Text fontSize="xl" mb={8}>
          Welcome back, nice to see you again!
        </Text>

        {/* Card for Statistics */}
        <Card borderRadius="lg" boxShadow="lg" p={6}>
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Your Dashboard Overview
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8} mt={4}>
              {/* Category Stats */}
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="blue.600">
                  Categories
                </StatLabel>
                <StatNumber fontSize="3xl">{totalCategories}</StatNumber>
                <StatHelpText fontSize="md">
                  Total number of categories
                </StatHelpText>
              </Stat>

              {/* Task Stats */}
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="purple.700">
                  Tasks
                </StatLabel>
                {/* <StatNumber fontSize="3xl">{totalTasks}</StatNumber> */}
                <StatHelpText fontSize="md">Total number of tasks</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="green.600">
                  Completed Tasks
                </StatLabel>
                {/* <StatNumber fontSize="3xl" color="green.500">
                  {completedTasks}
                </StatNumber> */}
                <StatHelpText fontSize="md">
                  Tasks that have been completed
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="red.600">
                  Pending Tasks
                </StatLabel>
                {/* <StatNumber fontSize="3xl" color="red.500">
                  {pendingTasks}
                </StatNumber> */}
                <StatHelpText fontSize="md">
                  Tasks yet to be completed
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="yellow.600">
                  In Progress Tasks
                </StatLabel>
                {/* <StatNumber fontSize="3xl" color="yellow.500">
                  {inProgressTasks}
                </StatNumber> */}
                <StatHelpText fontSize="md">
                  Tasks that are in progress
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold" color="gray.600">
                  Cancelled Tasks
                </StatLabel>
                {/* <StatNumber fontSize="3xl" color="gray.500">
                  {cancelledTasks}
                </StatNumber> */}
                <StatHelpText fontSize="md">
                  Tasks that have been cancelled
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            <Divider my={6} />

            {/* More content, like recent tasks, etc., can go here */}
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}

export default Dashboard;
