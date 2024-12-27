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
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, LoginService } from "../client";
import { isLoggedIn } from "../hooks/useAuth";
import useCustomToast from "../hooks/useCustomToast";
import { emailPattern, handleError } from "../utils";
import { Link as RouterLink } from "@tanstack/react-router";  // Correct import here

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
        <Heading size="md" color="ui.main" textAlign="center" mb={6}>
          Password Recovery
        </Heading>
        <Text textAlign="center" mb={6}>
          A password recovery email will be sent to the registered account.
        </Text>

        {/* Email Field */}
        <FormControl isInvalid={!!errors.email} mb={4}>
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
          mt={4}
        >
          Continue
        </Button>

        {/* Back to Login */}
        <Text mt={4} textAlign="center">
          Remembered your password?{" "}
          <Link as={RouterLink} to="/login" color="blue.500">
            Log In
          </Link>
        </Text>
      </Container>
    </Box>
  );
}

export default RecoverPassword;
