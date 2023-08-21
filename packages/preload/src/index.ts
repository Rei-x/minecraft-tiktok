/**
 * @module preload
 */

import { WebcastPushConnection } from "tiktok-live-connector";

export { sha256sum } from "./nodeCrypto";
export { versions } from "./versions";
export { lower } from "./lowerCase";
export { listFiles } from "./nodeCrypto";
import os from "os";
import * as fs from "fs";
import { MinecraftServer } from "minecraft-java-server";
// import * as https from "https";
import { paperClient } from "./paperClient";
import openapi from "./openapi";

export const createTiktokConnection = (username: string) => {
  return new WebcastPushConnection(username);
};

const listMinecraftVersions = async () => {
  const versionsQuery = await paperClient["/v2/projects/{project}"].get({
    params: {
      project: "paper",
    },
  });

  const { versions } = await versionsQuery.json();

  return versions;
};

const downloadMinecraftJar = async (version: string) => {
  const userHomeDirectory = os.homedir();

  const serverDirectory = `${userHomeDirectory}/.minecraft/server/${version}`;

  if (!fs.existsSync(serverDirectory)) {
    fs.mkdirSync(serverDirectory, { recursive: true });
  }

  const jarFile = `${serverDirectory}/server.jar`;

  if (fs.existsSync(jarFile)) {
    return {
      jarFile,
      serverDirectory,
    };
  }

  const buildsQuery = await paperClient["/v2/projects/{project}/versions/{version}"].get({
    params: {
      project: "paper",
      version: version,
    },
  });

  const { builds } = await buildsQuery.json();

  const latestBuild = builds?.at(-1) ?? 0;

  const serverJar = await paperClient[
    "/v2/projects/{project}/versions/{version}/builds/{build}/downloads/{download}"
  ].get({
    params: {
      version: version,
      project: "paper",
      build: latestBuild,
      download: `paper-${version}-${latestBuild}.jar`,
    },
  });

  const arrayBuffer = await serverJar.arrayBuffer();

  fs.writeFileSync(jarFile, Buffer.from(arrayBuffer));

  return { jarFile, serverDirectory };
};

export const startMinecraftServer = async () => {
  const version = "1.20.3";
  const { jarFile, serverDirectory } = await downloadMinecraftJar(version);
  const server = new MinecraftServer({
    jar: jarFile,
    path: serverDirectory,
    args: ["-Xms1G", "-Xmx1G"],
    // Minecraft's eula must be agreed to using this value
    eula: true,
    // every property is the equivalent of server.properties, except for vital ones
    properties: {
      motd: "Minecraft server hosted with minecraft-java-server",
      "max-players": 10,
    },
  });

  return server;
};
