import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Link,
  Text,
  Image,
  Heading,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import Logo from "/assets/images/fastapi-logo.svg";
import type { UserRegister } from "../client";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { confirmPasswordRules, emailPattern, passwordRules } from "../utils";

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

interface UserRegisterForm extends UserRegister {
  confirm_password: string;
}

function SignUp() {
  const { signUpMutation } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    <Box
      bgGradient="linear(to-br, gray.900, gray.800)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="md"
        p={8}
        boxShadow="2xl"
        borderRadius="xl"
        bg="gray.700"
      >
        <VStack spacing={6} color="white">
          {/* Logo */}
          <Image src={Logo} alt="FastAPI Logo" maxW="150px" />

          {/* Welcome Message */}
          <Heading size="lg" textAlign="center">
            Create Your Account
          </Heading>
          <Text color="gray.400" textAlign="center">
            Sign up to start managing your tasks efficiently.
          </Text>

          {/* Full Name Field */}
          <FormControl id="full_name" isInvalid={!!errors.full_name}>
            <FormLabel htmlFor="full_name">Full Name</FormLabel>
            <Input
              id="full_name"
              {...register("full_name", { required: "Full Name is required" })}
              placeholder="Full Name"
              focusBorderColor="blue.500"
              bg="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              borderRadius="md"
            />
            {errors.full_name && (
              <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Email Field */}
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
              focusBorderColor="blue.500"
              bg="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              borderRadius="md"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl id="password" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              {...register("password", passwordRules())}
              placeholder="Password"
              type="password"
              focusBorderColor="blue.500"
              bg="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              borderRadius="md"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl
            id="confirm_password"
            isInvalid={!!errors.confirm_password}
          >
            <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
            <Input
              id="confirm_password"
              {...register(
                "confirm_password",
                confirmPasswordRules(getValues)
              )}
              placeholder="Confirm Password"
              type="password"
              focusBorderColor="blue.500"
              bg="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              borderRadius="md"
            />
            {errors.confirm_password && (
              <FormErrorMessage>
                {errors.confirm_password.message}
              </FormErrorMessage>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isSubmitting}
            _hover={{ bg: "blue.600" }}
            borderRadius="md"
          >
            Sign Up
          </Button>

          {/* Already Have an Account */}
          <Text fontSize="sm" color="gray.400">
            Already have an account?{" "}
            <Link as={RouterLink} to="/login" color="blue.400" _hover={{ textDecoration: "underline" }}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default SignUp;
