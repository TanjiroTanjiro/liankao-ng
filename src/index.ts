import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import openapi from "@elysiajs/openapi";

const app = new Elysia().use(auth).use(openapi()).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
