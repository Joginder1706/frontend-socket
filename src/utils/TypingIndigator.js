import React from "react";
import { HStack, Box, Spinner } from "@chakra-ui/react";

const TypingIndicator = () => {
  return (
    <HStack spacing="3px">      
      <Spinner size="xs" speed="0.8s" />
      <Spinner size="xs" speed="0.8s" />
      <Spinner size="xs" speed="0.8s" />
    </HStack>
  );
};

export default TypingIndicator;
