import { Box, Container, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Divider, VStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "../../client"; 
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "../../hooks/useAuth"
const PER_PAGE = 5;

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})


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

function Dashboard() {
  const { user: currentUser } = useAuth(); // Giả sử bạn đang sử dụng hook này để lấy thông tin người dùng.

  // Fetch categories và total count
  const { data: categories, isLoading, isError } = useQuery({
    ...getCategoriesQueryOptions(),
  });

  // Hiển thị loading hoặc lỗi
  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError) {
    return <Text color="red.500">There was an error loading categories</Text>;
  }

  // Lấy tổng số category từ dữ liệu trả về từ API
  const totalCategories = categories?.count || 0; // Dữ liệu trả về có trường 'count'

  return (
    <Container maxW="full" p={0} h="100vh">
      <Box pt={12} m={4} h="100%" display="flex" flexDirection="column" >
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
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold">Categories</StatLabel>
                <StatNumber fontSize="3xl">{totalCategories}</StatNumber> {/* Hiển thị tổng số categories */}
                <StatHelpText fontSize="md">Total number of categories</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold">Tasks</StatLabel>
                <StatNumber fontSize="3xl">0</StatNumber>
                <StatHelpText fontSize="md">Total number of tasks</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold">Completed Tasks</StatLabel>
                <StatNumber fontSize="3xl" color="green.500">0</StatNumber>
                <StatHelpText fontSize="md">Tasks that have been completed</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel fontSize="xl" fontWeight="bold">Pending Tasks</StatLabel>
                <StatNumber fontSize="3xl" color="red.500">0</StatNumber>
                <StatHelpText fontSize="md">Tasks yet to be completed</StatHelpText>
              </Stat>
            </SimpleGrid>

            <Divider my={6} />

          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}

export default Dashboard;