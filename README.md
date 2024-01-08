# Brush game

- This project is in progress
- Please read the RULES.md and TODO.md files
- This projects uses turbo monorepo and npm as a package manager
- Backend uses NestJS
- Fronted uses React with Vite
- This projects uses postgresql please run it locally for development and set the connection parameters in a .env file on the backend root
- Run the development version using npm run dev

### Example of postgresql and pgadmin compose for local development

```
version: '3.8'
services:
  db:
    container_name: pg_container
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: test_db
    ports:
      - "5432:5432"
  pgadmin:
    container_name: pgadmin4_container
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "5050:80"
```
