## Todo

- Organize files and folder structure
- Check if types and mappers are where they should be
- Check if mappers should really be a class
- Delete getAll deleteAll
- Free up old and completed games id
- Allow players to send reactions when playing (Like rocket league, but emojis)
- Fix eslint and tsconfig packages, decide wether the should be a package or just in the root
- Delete the UI package
- Create docker compose that runs everything (including PostgreSQL) check if env is working
- Add github actions for auto-deploy
- Fix file naming (casing)
- Room creator may kick anyone
- Leader Board
- Tentar servir react buildado com back
- Criar migrations
- Separar componentes no mesmo arquivo
- Impedir mais de um jogo ao mesmo tempo
- Criar toast handler
- Arrumar enum socket events
- Tratar 404 (front)
- Tratar 404 (back)

#### Frontend

- Fix manifest
- Add G-TAG and add cookie banner
- Add titles
- Change room id placeholder and add tooltip with phrase

### Game flow

- Create room
- Opponent(s) enter room
- Start game
- Next Round (until someone reaches 15 points)
  - Any player may leave at any time, if only one player is left, end the game
  - If a player leaves during the game, room creator may kick them.
  - Room creator may kick anyone
- End game
- Save results to leader board ONLY IF THEY EXCEED PREVIOUS LEADER

### Leader Board metrics

- Most points
- Most difference between winner and second place
- Least rounds
- Most rounds

### Maybe

- Allow players to select different deck designs
  - This involves deciding wether deck designs are local or by room
