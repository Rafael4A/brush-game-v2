# Brush game

- This project is in progress
- Please read the RULES.md and TODO.md files
- This projects uses turbo monorepo and npm as a package manager
- Backend uses NestJS
- Fronted will use react, I'm still deciding between Vite and Next.js, but it'll probably use Vite
- Shared eslint config and tsconfig need to be fixed and evaluated if it's worth being in packages instead of in the root
- UI packaged will probably be deleted since there will be only one frontend project
- Currently only the backend is being developed and the frontend is the default turbo sample
- This projects uses mongodb please run it locally for development and update the connection string manually in `app.module.ts`
- Run the development version using npm run dev

### Mongodb compose for development

```
version: '3.3'
services:
    mongo:
        ports:
            - '27017:27017'
        container_name: mongo
        restart: always
        logging:
            options:
                max-size: 1g
        environment:
            - MONGO_INITDB_ROOT_USERNAME=YOURUSER
            - MONGO_INITDB_ROOT_PASSWORD=YOURPASS
        image: mongo
```
