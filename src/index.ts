import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { view } from "./modules/view"
import openapi from "@elysiajs/openapi";
import prisma from "./prisma";

const app = new Elysia()
    .use(auth)
    .use(view)
    .use(openapi())
    .get('/status', () => {
        return {message: 'API ready'}
    })
    .listen(3000);


