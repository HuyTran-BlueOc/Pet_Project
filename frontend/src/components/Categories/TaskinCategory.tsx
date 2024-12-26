// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Table, Tbody, Td, Th, Thead, Tr, Box } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { CategoryReadTaskData } from "../../client";  // Import the correct function
// import { Item } from "../../client/types"; // Assuming `Task` type is defined in your client

// type CategoryTasksModalProps = {
//   categoryId: string | null;
//   isOpen: boolean;
//   onClose: () => void;
// };

// const CategoryTasksModal = ({ categoryId, isOpen, onClose }: CategoryTasksModalProps) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (categoryId && isOpen) {
//       setLoading(true);
//       setError(null);

//       // Call the API function - assuming it takes an object with an `id` field
//       CategoryReadTaskData({ id: categoryId })
//         .then((response) => {
//           setTasks(response.data); // Ensure `response.data` is the tasks
//         })
//         .catch((err) => {
//           setError("Failed to fetch tasks. Please try again later.");
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [categoryId, isOpen]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Tasks for Category: {categoryId}</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {loading ? (
//             <Box>Loading...</Box>
//           ) : error ? (
//             <Box color="red">{error}</Box>
//           ) : tasks.length === 0 ? (
//             <Box>No tasks found for this category.</Box>
//           ) : (
//             <Table size="sm">
//               <Thead>
//                 <Tr>
//                   <Th>Title</Th>
//                   <Th>Description</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {tasks.map((task) => (
//                   <Tr key={task.id}>
//                     <Td>{task.title}</Td>
//                     <Td>{task.description}</Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>
//           )}
//         </ModalBody>

//         <ModalFooter>
//           <Button colorScheme="blue" onClick={onClose}>
//             Close
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CategoryTasksModal;
