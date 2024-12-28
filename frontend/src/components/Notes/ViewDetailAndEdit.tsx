import React, { useState } from 'react'
import {
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
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react";
import AccordionConfig from "../Common/AccordionConfig"
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ApiError, INote, INoteInit, INotesDelete, TasksService } from '../../client';
import useCustomToast from '../../hooks/useCustomToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleError } from '../../utils';

interface ViewDetailAndEditProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    title: string;
    description: string;
}

const ViewDetailAndEdit: React.FC<ViewDetailAndEditProps> = ({
    id,
    isOpen,
    onClose
}) => {
    const showToast = useCustomToast();
    const queryClient = useQueryClient();
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [selectedNote, setSelectedNote] = useState<INote | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["notes", id],
        queryFn: async () => {
            try {
                return await TasksService.readNotesByIdTask({ id });
            } catch (err) {
                showToast(
                "Error",
                "Failed to load note details. Please try again later.",
                "error"
                );
                throw err;
            }
        },
        enabled: isOpen, 
    });

    const allnotes: INote[] = data?.data ?? [];

    const isAllSelected = selectedItems.length === allnotes?.length && allnotes?.length > 0;

    const handleSelectItem = (idNote: string) => {
        setSelectedItems((prev) => prev.includes(idNote) ? prev.filter((item) => item !== idNote) : [...prev, idNote]);
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(allnotes?.map((item) => item.id));
        }
    }

    const mutationAddAndUpdate = useMutation({
        mutationFn: async (data: INoteInit) => {
            if(selectedNote){
                await TasksService.updateNote({
                    note_id: selectedNote.id,
                    requestBody: {
                        title: data.title,
                        description: data.description
                    }
                })
            }else{
                await TasksService.createNote({ 
                    task_id: id,
                    requestBody: data
                });
            }
        },
      
        onSuccess: () => {
            showToast("Success!", `Note ${selectedNote ? 'updated' : 'created'} successfully.`, "success");
            setSelectedNote(null)
            setIsAdding(false);
            reset();
        },
        onError: (err: ApiError) => {
          handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });

    const handleSaveClick = (data: FormData) => {
        mutationAddAndUpdate.mutate(data);
    };

    const mutationDelete = useMutation({
        mutationFn: async (data: INotesDelete) => {
          await TasksService.deleteNotesByIds({
            ids: data.ids,
          }); 
        },
        onSuccess: () => {
          showToast(
            "Success",
            "Notes deleted successfully.",
            "success"
          );
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          reset();
          setSelectedItems([]);
        },
        onError: () => {
          showToast(
            "Error",
            "An error occurred while deleting notes.",
            "error"
          );
        },
    });

    const handleCancelClick = () => {
        setSelectedNote(null);
        setIsAdding(false);
        reset();
    };

    const handleAddClick = () => {
        setSelectedNote(null);
        setIsAdding(true);
        reset({ title: '', description: '' });
    };

    const handleEditClick = (note: INote) => {
        setSelectedNote(note);
        setIsAdding(true);
        reset(note);
    };

    const handleDeleteClick = () => {
        mutationDelete.mutate({ ids: selectedItems });
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
                                        placeholder="Description"
                                        {...register('description', { required: 'Description is required' })}
                                    />
                                    {errors.description && <span>{errors.description.message}</span>}
                                </Stack>
                                <Flex gap={4} justify="flex-end" mt={4}>
                                    <Button background={'teal'} type="submit">Save</Button>
                                    <Button onClick={handleCancelClick}>Cancel</Button>
                                </Flex>
                            </Box>
                        ) : (
                            <Box width={'100%'}>
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
                                    {isLoading ? <Skeleton height={'6'} isLoaded={!isLoading}/> :<AccordionConfig onEdit={handleEditClick} items={allnotes} selectedItems={selectedItems} handleSelectItem={handleSelectItem}/>}
                                    {error && <Text color={'red'}>{error.message}</Text>}
                                </Stack>
                            </Box>
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


