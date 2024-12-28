import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AiFillUpSquare, AiFillDownSquare } from "react-icons/ai";
import { INote } from '../../client';
import { FaEdit } from 'react-icons/fa';

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Box = styled.div`
    margin: 5px 0;
`;

const AccordionTitle = styled.div`
  background: teal;
  color: white;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
`;

const BoxInsideTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BoxInsideTitle2 = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    align-items: center;
`;

const BoxInsideTitle3 = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    align-items: center;
`;

const AccordionContent = styled(motion.div)<{ $isOpen: boolean }>`
  background: gray;
  color: white;
  border: 1px solid #ddd;
  border-top: none;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '100%' : '0')};
`;

interface AccordionItemProps {
    note: INote;
    isSelected?: boolean;
    onSelect: () => void;
    onEdit: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ note, isSelected, onSelect, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCheckboxClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onSelect();
    };

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit();
    };

    return (
        <Box>
            <AccordionTitle onClick={() => setIsOpen(!isOpen)}>
                <BoxInsideTitle>
                    <BoxInsideTitle2>
                        <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onClick={handleCheckboxClick} 
                            readOnly
                        />
                        <div>{note.title}</div>
                    </BoxInsideTitle2>
                    <BoxInsideTitle3>
                        <FaEdit onClick={handleEditClick}/>
                        {isOpen ? <AiFillUpSquare /> : <AiFillDownSquare />}
                    </BoxInsideTitle3>
                </BoxInsideTitle>
            </AccordionTitle>
            <AccordionContent 
                $isOpen={isOpen}
                initial={{ height: 0 }} 
                animate={{ height: isOpen ? 'auto' : 0 }} 
                transition={{ duration: 0.3 }}
            >
                <div style={{ padding: '1rem' }}>{note.description}</div>
            </AccordionContent>
        </Box>
    );
};

interface AccordionProps {
    items: INote[];
    selectedItems: string[];
    handleSelectItem: (id: string) => void;
    onEdit: (note: INote) => void;
}

const AccordionConfig: React.FC<AccordionProps> = ({ items, selectedItems, handleSelectItem, onEdit }) => {

    return (
        <AccordionSection>
            {items.map((item: INote, index) => (
                <AccordionItem 
                    key={index} 
                    note={item}
                    isSelected={selectedItems.includes(item?.id)} 
                    onSelect={() => handleSelectItem(item?.id)} 
                    onEdit={() => onEdit(item)}
                />
            ))}
        </AccordionSection>
    );
};

export default AccordionConfig;
