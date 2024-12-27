import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useBoolean,
  Box,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import Logo from "/assets/images/fastapi-logo.svg";
import type { Body_login_login_access_token as AccessToken } from "../client";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { emailPattern } from "../utils";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function Login() {
  const [show, setShow] = useBoolean();
  const { loginMutation, error, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return;

    resetError();

    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // error is handled by useAuth hook
    }
  };

  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="sm"
        p={8}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <VStack spacing={6}>
          <Image src={Logo} alt="FastAPI logo" maxW="150px" />
          <Heading size="lg" textAlign="center">
            Welcome Back
          </Heading>
          <Text color="gray.600" textAlign="center">
            Log in to continue to your dashboard.
          </Text>

          {/* Username Field */}
          <FormControl id="username" isInvalid={!!errors.username || !!error}>
            <Input
              id="username"
              {...register("username", {
                required: "Username is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
              aria-label="Email"
              focusBorderColor="blue.500"
            />
            {errors.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl id="password" isInvalid={!!error}>
            <InputGroup>
              <Input
                {...register("password", {
                  required: "Password is required",
                })}
                type={show ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                focusBorderColor="blue.500"
              />
              <InputRightElement>
                <Icon
                  as={show ? ViewOffIcon : ViewIcon}
                  onClick={setShow.toggle}
                  _hover={{ cursor: "pointer" }}
                  aria-label={show ? "Hide password" : "Show password"}
                />
              </InputRightElement>
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          {/* Forgot Password */}
          <Link as={RouterLink} to="/recover-password" color="blue.500">
            Forgot password?
          </Link>

          {/* Submit Button */}
          <Button
            variant="solid"
            colorScheme="blue"
            type="submit"
            isLoading={isSubmitting}
            width="full"
          >
            Log In
          </Button>

          {/* Sign Up */}
          <Text fontSize="sm" color="gray.600">
            Don't have an account?{" "}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
