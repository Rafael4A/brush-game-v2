## Todo

- Create docker compose that runs everything (including PostgreSQL) check if env is working
- Add github actions for auto-deploy
- Criar migrations
- Review SonarLint issues
- Fix theme colors: filter only used

#### Frontend

- Fix manifest
- Add G-TAG and add cookie banner
- Look into route lazy loading and cards preload (fetch whole deck before showing)

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
