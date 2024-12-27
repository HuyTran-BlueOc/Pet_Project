import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FiBriefcase, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import type { UserPublic } from "../../client";

const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiBriefcase, title: "Tasks", path: "/tasks" },
  { icon: FiSettings, title: "User Settings", path: "/settings" },
  { icon: BiCategoryAlt, title: "Categories", path: "/categories" }
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("gray.700", "gray.100"); // Softer color for text
  const activeBgColor = useColorModeValue("#4C51BF", "#2D3748"); // Active item background color with contrast
  const hoverBgColor = useColorModeValue("#E2E8F0", "#4A5568"); // Lighter hover background
  const iconColor = useColorModeValue("gray.600", "gray.300"); // Icon color
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items;

  const listItems = finalItems.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={3}
      key={title}
      align="center"
      justify="start"
      borderRadius="lg"
      _hover={{
        bg: hoverBgColor, // Change background on hover
        transition: "background-color 0.2s ease", // Smooth transition for hover effect
      }}
      _active={{
        bg: activeBgColor, // Active state background
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" color={iconColor} />
      <Text ml={4} fontSize="lg">{title}</Text>
    </Flex>
  ));

  return <Box>{listItems}</Box>;
};

export default SidebarItems;
