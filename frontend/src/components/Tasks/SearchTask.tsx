import { Input, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

type SearchCategoryProps = {
  search: string;  // The current search term (state)
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  // Function to update the search term (from the parent)
};

const SearchTask = ({ search, onSearchChange }: SearchCategoryProps) => {
  return (
    <InputGroup mb={4} >
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search categories"
        value={search}
        onChange={onSearchChange}  // Use the passed down handler to update the state
      />
    </InputGroup>
  );
};

export default SearchTask;
