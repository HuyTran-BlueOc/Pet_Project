import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, LoginService } from "../client";
import { isLoggedIn } from "../hooks/useAuth";
import useCustomToast from "../hooks/useCustomToast";
import { emailPattern, handleError } from "../utils";
import { Link as RouterLink } from "@tanstack/react-router";

interface FormData {
  email: string;
}

export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RecoverPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const showToast = useCustomToast();

  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    });
  };

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showToast(
        "Email sent.",
        "We sent an email with a link to get back into your account.",
        "success"
      );
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutation.mutate(data);
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
        maxW="sm"
        p={8}
        boxShadow="2xl"
        borderRadius="xl"
        bg="gray.700"
        color="white"
      >
        <VStack spacing={6}>
          {/* Heading */}
          <Heading size="lg" textAlign="center">
            Password Recovery
          </Heading>
          <Text textAlign="center" color="gray.300" fontSize="sm">
            Enter your registered email address, and we’ll send you a link to reset your password.
          </Text>

          {/* Email Field */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Enter your email"
              type="email"
              focusBorderColor="blue.500"
              bg="gray.600"
              borderRadius="md"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _hover={{ bg: "gray.500" }}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            colorScheme="blue"
            type="submit"
            width="full"
            isLoading={isSubmitting}
            size="lg"
            _hover={{ bg: "blue.600" }}
          >
            Send Recovery Email
          </Button>

          {/* Back to Login */}
          <Text fontSize="sm" color="gray.300" textAlign="center">
            Remembered your password?{" "}
            <Link as={RouterLink} to="/login" color="blue.400" _hover={{ textDecoration: "underline" }}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default RecoverPassword;
