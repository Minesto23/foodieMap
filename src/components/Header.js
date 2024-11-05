import React from "react";
import { Box, Flex, Text, Button, Image, VStack, HStack, useBreakpointValue } from "@chakra-ui/react";

const Header = () => {
  // Cambiar de HStack a VStack en pantallas pequeñas
  const StackComponent = useBreakpointValue({ base: VStack, md: HStack });

  return (
    <Box bg="gray.100" px={6}>
      <Flex
        h={{ base: "auto", md: 16 }} // Ajuste de altura en pantallas pequeñas
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        direction={{ base: "column", md: "row" }} // Cambia a columna en pantallas pequeñas
        py={{ base: 4, md: 0 }} // Añade padding vertical en pantallas pequeñas
      >
        {/* Logo y título */}
        <Flex alignItems="center" mb={{ base: 4, md: 0 }}> {/* Margen inferior solo en móvil */}
          <Image
            src="/logo192.png"
            alt="Logo"
            boxSize="40px"
            objectFit="cover"
            mr={2}
          />
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" ml={3}>
            Foodie
          </Text>
        </Flex>

        {/* Texto y botón de contacto, usando VStack en pantallas pequeñas */}
        <StackComponent spacing={{ base: 2, md: 4 }} align="center">
          <Text fontSize={{ base: "sm", md: "md" }}>¿Quieres ser parte de nuestra familia?</Text>
          <Button
            as="a"
            href="https://foodie.com"
            target="_blank"
            colorScheme="red"
            // size={{ base: "sm", md: "md" }}
          >
            Contáctanos
          </Button>
        </StackComponent>
      </Flex>
    </Box>
  );
};

export default Header;
