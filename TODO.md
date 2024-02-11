## Todo

- Delete getAll deleteAll
- Create docker compose that runs everything (including PostgreSQL) check if env is working
- Add github actions for auto-deploy
- Leader Board?
- Tentar servir react buildado com back
- Criar migrations
- Tratar 404 (back)
- Fix import order (set shared-code package to be the last of the dependencies group)
- Review SonarLint issues
- Add chime option
- Fix theme colors casing and filter only used

#### Frontend

- Fix manifest
- Add G-TAG and add cookie banner

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
