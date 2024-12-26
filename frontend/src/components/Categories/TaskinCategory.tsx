// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Table,
//   Tbody,
//   Td,
//   Th,
//   Thead,
//   Tr,
//   Box,
// } from "@chakra-ui/react";
// import {  useState } from "react";
// // Define the Task type (adjust based on your actual API response structure)
// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   status: string; // Add fields that exist in your task model
//   due_date?: string; // Example optional field
// };

// type CategoryTasksModalProps = {
//   categoryId: string | null;
//   isOpen: boolean;
//   onClose: () => void;
// };

// const CategoryTasksModal = ({ categoryId, isOpen, onClose }: CategoryTasksModalProps) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting, errors, isDirty },
//   } = useForm<CategoryUpdate>({
//     mode: "onBlur",
//     criteriaMode: "all",
//     defaultValues: category,
//   });


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
//                   <Th>Status</Th>
//                   <Th>Due Date</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {tasks.map((task) => (
//                   <Tr key={task.id}>
//                     <Td>{task.title}</Td>
//                     <Td>{task.description}</Td>
//                     <Td>{task.status}</Td>
//                     <Td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}</Td>
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
