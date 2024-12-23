import {
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  SkeletonText,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";
import ItemModal from "../../components/Categories/TaskinCategory";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CategoriesService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import { PaginationFooter } from "../../components/Common/PaginationFooter";
import AddCategory from "../../components/Categories/AddCategory";
import DeleteAllCategories from "../../components/Categories/DeleteAllCategory"
const CategoriesSearchSchema = z.object({
  page: z.number().catch(1),
});

type Category = {
  id: string;
  title: string;
  description?: string | null;
};
export const Route = createFileRoute("/_layout/categories")({
  component: Categories,
  validateSearch: (search) => CategoriesSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getCategoriesQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      CategoriesService.readCategories({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["categories", { page }],
  };
}

function CategoriesTable() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const {
    data: categories,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getCategoriesQueryOptions({ page }),
    placeholderData: (preData) => preData,
  });

  const hasNextPage =
    !isPlaceholderData && categories?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getCategoriesQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  const openModalWithCategory = (category: Category) => {
    setSelectedCategory(category);
    onOpen();
  };

  
  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Numerical Order</Th>
              <Th>Title</Th>
              <Th>Description</Th>
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
              {categories?.data.map((category, index) => (
                <Tr key={category.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td
                    onClick={() => openModalWithCategory(category)}
                    _hover={{
                      // bg: "linear-gradient(90deg, #2b6cb0, #63b3ed)", // Màu gradient xanh
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {index + 1}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {category.title}
                  </Td>
                  <Td
                    color={!category.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {category.description || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Category"} value={category} />
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

      <ItemModal
        isOpen={isOpen}
        onClose={onClose}
        categoryId={selectedCategory?.id || null}
        categoryTitle={selectedCategory?.title || null}
      />
    </>
  );
}

function Categories() {
  
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Categories Management
      </Heading>
      <Navbar
        type={"Category"}
        addModalAs={AddCategory}
        deleteModalAs={DeleteAllCategories}
      />
      <CategoriesTable />
    </Container>
  );
}
