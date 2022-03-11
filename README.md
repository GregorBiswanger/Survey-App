# Survey-App

The poll app allows creating polls via a web app. Respondents can take a survey anonymously.
The project is part of a German developer community "My Coding Zone". This application was developed step by step via Twitch live stream.  
  
The tech stack is based on the MEAN stack (MongoDB-Expressjs-Angular-Nodejs).  
  
[The tasks to develop are on Trello](https://trello.com/b/15LQ5smt)  
[The community on Discord in the "Survey App" channel](https://discord.com/channels/724358635593138177/947580454226247780)

## YouTube videos showing the making of the app (In German):  
_(Follows after completion of the app)_  

## Required for development:
- Nodejs (16.13.1)
- MongoDB on mongodb://ocalhost:27017  
 ``` docker run -p 27017:27017 mongo```

## Architecture
- Server
  - Based on Express.js
  - Used Socket.io
  - Used the native MongoDB driver
- Client
  - Based on Angular
  - Used Angular Material
  
## Project setup  

Start MongoDB with the default port. In this `root`, `server`
  and `client` folders, run the `npm install` or the `pnpm install` command.

## Run project  

## Build project  