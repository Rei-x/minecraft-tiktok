import {
  Button,
  ChakraProvider,
  Container,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createTiktokConnection, listFiles } from "#preload";
import { startMinecraftServer } from "#preload";
import type { MinecraftServer } from "minecraft-java-server";

export const App = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState({});
  const [server, setServer] = useState<MinecraftServer>();
  const [console, setConsole] = useState<string[]>([]);

  useEffect(() => {
    server?.on("console", (log) => {
      setConsole([...console, log]);
    });

    return () => {
      server?.off("console");
    };
  });
  return (
    <ChakraProvider>
      <Container>
        <FormControl>
          <FormLabel>Username</FormLabel>
        </FormControl>
        <List>
          {listFiles().map((file) => (
            <ListItem key={file.name}>{file.name}</ListItem>
          ))}
        </List>
        <Button
          onClick={async () => {
            const server = await startMinecraftServer();

            setServer(server);
          }}
        ></Button>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </Container>
    </ChakraProvider>
  );
};
