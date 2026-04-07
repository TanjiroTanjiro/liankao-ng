import { Elysia, status } from "elysia";
import { auth } from "./modules/auth";
import { contest } from "./modules/contest"
import { problem } from "./modules/problem"
import openapi from "@elysiajs/openapi";

const app = new Elysia({ prefix: '/api' })
    .use(auth)
    .use(contest)
    .use(problem)
    .use(openapi({
      documentation: {
        info: {
          title: 'liankao-ng API',
          version: '1.0.0',
        },
        tags: [
          { name: 'auth', description: '注册与登录' },
          { name: 'contest', description: '比赛（需登录）' },
          { name: 'problem', description: '题目（需登录）' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    }))
    .get('/*', () => {
        return status(404,{message:"API not found."});
    })
    .listen(3000);


