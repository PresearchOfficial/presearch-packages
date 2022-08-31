The API used is https://www.api-football.com/documentation-v3

# Features

- The user can search by team or by league name.
- It will show games from the past, future or live.
- When search by a team name it will emphase the game closest to today in the games search table (for example, if the team played yesterday it will show that game)
- The user can see the standings of a league. When search by a team it will recognize the league from the team.

# Load data

To load static data from the sports API we must run with node the script loadData.js. The script will create two files: teams.json and leagues.json. The array present in the file (*leaguesIdArray*) represents the ids of the leagues to import. The two json files will be used in the package trigger function, avoiding that every search calls the sports API.
We must add the API key In the script file.

# Next steps

- The package only works for soccer. Other sports will be included.
- Show more statistics about a game when the user clicks in it.