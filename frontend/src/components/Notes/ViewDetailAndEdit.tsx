import React, { useState } from 'react'
import {
    AccordionItem,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    Input,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import AccordionConfig from "../Common/AccordionConfig"
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

interface ViewDetailAndEditProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    title: string;
    content: string;
}

const items = [
    { value: "first-item", title: "First Item", content: "Some value 1..." },
    { value: "second-item", title: "Second Item", content: "Some value 2..." },
    { value: "third-item", title: "Third Item", content: "Some value 3..." },
]

const ViewDetailAndEdit: React.FC<ViewDetailAndEditProps> = ({
    id,
    isOpen,
    onClose
}) => {
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const isAllSelected = selectedItems.length === items.length && items.length > 0;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    const handleSelectItem = (value: string) => {
        setSelectedItems((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((item) => item.value));
        }
    }

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleSaveClick = (data: FormData) => {
        // Handle save logic here
        console.log('Saved data:', data);
        setIsAdding(false);
        reset();
    };

    const handleCancelClick = () => {
        setIsAdding(false);
        reset();
    };

    const handleDeleteClick = () => {
        // Handle delete logic here
        console.log('Delete items:', selectedItems);
    }

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
            size={'lg'}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>Notes Details</AlertDialogHeader>
                    <AlertDialogBody>
                    {isAdding ? (
                            <Box as="form" onSubmit={handleSubmit(handleSaveClick)}>
                                <Stack spacing={4}>
                                    <Input
                                        placeholder="Title"
                                        {...register('title', { required: 'Title is required' })}
                                    />
                                    {errors.title && <span>{errors.title.message}</span>}
                                    <Input
                                        placeholder="Content"
                                        {...register('content', { required: 'Content is required' })}
                                    />
                                    {errors.content && <span>{errors.content.message}</span>}
                                </Stack>
                                <Flex gap={4} justify="flex-end" mt={4}>
                                    <Button background={'teal'} type="submit">Save</Button>
                                    <Button onClick={handleCancelClick}>Cancel</Button>
                                </Flex>
                            </Box>
                        ) : (
                            <>
                                <Flex gap={4} justify={'space-between'} align="center">
                                    <div style={{ marginLeft: "6px"}}>
                                        <input type="checkbox" checked={isAllSelected} onClick={handleSelectAll} readOnly/>
                                    </div>
                                    <Flex gap={4}>
                                        <Button onClick={handleAddClick}>Add</Button>
                                        <ButtonDelete onClick={handleDeleteClick} $disabled={selectedItems.length === 0} $background={selectedItems.length === 0 ? 'gray' : 'red'}>Delete</ButtonDelete>
                                    </Flex>
                                </Flex>
                                <Stack gap="4">
                                    <AccordionConfig items={items} selectedItems={selectedItems} handleSelectItem={handleSelectItem}/>
                                </Stack>
                            </>
                        )}  
                    </AlertDialogBody>
                    <AlertDialogFooter gap={3}>
                        <Button ref={cancelRef} onClick={onClose}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default ViewDetailAndEdit


const ButtonDelete = styled.button<{ $disabled: boolean, $background: string }>`
    background: ${({ $background }) => $background};
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer !important;
    opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
    pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.9;
    }
`


