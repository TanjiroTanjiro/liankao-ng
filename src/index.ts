import { Elysia, status } from "elysia";
import { auth } from "./modules/auth";
import { view } from "./modules/view"
import openapi from "@elysiajs/openapi";

const app = new Elysia({ prefix: '/api' })
    .use(auth)
    .use(view)
    .use(openapi())
    .get('/*', () => {
        return status(404,{message:"API not found."});
    })
    .listen(3000);


