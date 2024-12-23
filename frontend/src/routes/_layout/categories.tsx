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
  Spinner, 
  useDisclosure
} from "@chakra-ui/react";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CategoriesService, ItemsService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import { PaginationFooter } from "../../components/Common/PaginationFooter";
import AddCategory from "../../components/Categories/AddCategory";
const CategoriesSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/categories" )({
  component: Categories,
  validateSearch: (search) => CategoriesSearchSchema.parse(search),
});


const PER_PAGE = 5 

function getCategoriesQueryOptions({page}: {page: number}){
  return {
    queryFn:() => 
        CategoriesService.readCategories({skip: (page - 1 ) * PER_PAGE, limit: PER_PAGE}),
    queryKey: ["categories", {page}],
  }
}




function CategoriesTable() {
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const navigate = useNavigate({from: Route.fullPath})
  const setPage = (page:number) => 
    navigate({search: (prev: {[key: string]: string}) => ({...prev, page})})

  const {
    data: categories,
    isPending,
    isPlaceholderData,
  } = useQuery ({
    ...getCategoriesQueryOptions({page}),
    placeholderData: (preData) => preData, 
  })

  const hasNextPage = !isPlaceholderData && categories?.data.length === PER_PAGE
  const hasPreviousPage = page > 1 

  useEffect(() => {
    if(hasNextPage) {
      queryClient.prefetchQuery(getCategoriesQueryOptions({page: page + 1}))
    }
  }, [page, queryClient, hasNextPage])
  
 

  return ( 
    <>
      <TableContainer>
        <Table size={{base: "sm", md:"md"}}>
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
                {new Array(4).fill(null).map((_,index)=> (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px"/>
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {categories?.data.map((category, index) => (
                <Tr key={category.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td>{index + 1 }</Td>
                  <Td isTruncated maxWidth="150px">{category.title}</Td>
                  <Td 
                    color={!category.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"  
                  >
                    {category.description || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Category"}  value={category}/>
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

  )
}



function Categories() {
  return (
    <Container maxW='full'>
      <Heading size="lg" textAlign={{base: "center", md: "left"}} pt={12}>
        Categories Management
      </Heading>
      <Navbar type={"Category"} addModalAs={AddCategory}/>
      <CategoriesTable/>
    </Container>
  );
}
