import { useColorModeValue } from '@chakra-ui/react';
import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { AiFillUpSquare, AiFillDownSquare } from "react-icons/ai";

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

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  background: gray;
  color: white;
  border: 1px solid #ddd;
  border-top: none;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '100%' : '0')};
  transition: max-height 0.3s ease;
`;

interface AccordionItemProps {
    title: string;
    content: ReactNode;
    isSelected?: boolean;
    onSelect: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isSelected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCheckboxClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onSelect();
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
                        <div>{title}</div>
                    </BoxInsideTitle2>
                    <div>{isOpen ? <AiFillUpSquare /> : <AiFillDownSquare />}</div>
                </BoxInsideTitle>
            </AccordionTitle>
            <AccordionContent $isOpen={isOpen}>
                <div style={{ padding: '1rem' }}>{content}</div>
            </AccordionContent>
        </Box>
    );
};

interface AccordionProps {
    items: any[];
    selectedItems: string[];
    handleSelectItem: (value: string) => void;
}

const AccordionConfig: React.FC<AccordionProps> = ({ items, selectedItems, handleSelectItem }) => {

    return (
        <AccordionSection>
            {items.map((item: any, index) => (
                <AccordionItem key={index} isSelected={selectedItems.includes(item?.value)} onSelect={() => handleSelectItem(item?.value)} title={item.title} content={item.content} />
            ))}
        </AccordionSection>
    );
};

export default AccordionConfig;
