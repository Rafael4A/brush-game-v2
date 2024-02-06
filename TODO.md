## Todo

- Check if types and mappers are where they should be
- Check if mappers should really be a class
- Delete getAll deleteAll
- Free up old and completed games id
- Create docker compose that runs everything (including PostgreSQL) check if env is working
- Add github actions for auto-deploy
- Room creator may kick anyone
- Leader Board
- Tentar servir react buildado com back
- Criar migrations
- Impedir mais de um jogo ao mesmo tempo
- Criar toast handler
- Tratar 404 (front)
- Tratar 404 (back)
- Disable auto complete for room id field
- Fix import order (set shared-code package to be the last of the dependencies group)
- Review functions that avoid too much mutability (look for reduces)
- Review SonarLint issues
- BUSCAR POR THIS.ALGO nas funções extraídas para SHARED CODE
- Fix bug that when a user clicks on leave game they receive a message saying that the connection was lost
- Add chime option
- Fix theme colors casing and filter only used

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
