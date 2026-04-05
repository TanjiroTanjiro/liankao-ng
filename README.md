`bun run dev` 来启动。

打开 http://localhost:3000/openapi 来看 apidocs.

`bunx --bun prisma studio &` 这样来看数据库

`.agents/*` 里面有给 LLM 看的文档。

你需要先安装 bun，然后没准要升级一下 node。

`bun install` 会自动安装依赖。

`.env` 里面设置一下这两个：

```
DATABASE_URL="file:./data.db"

JWT_SECRET="Your Super-Secret Token"
```

询问 LLM 似乎永远是个好主意。