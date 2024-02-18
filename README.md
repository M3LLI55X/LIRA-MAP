# LiRA-Map
This document will explain how to build, test and deploy both the client and server application of the LiRA Map project.
It is assumed that our [repo](https://gitlab.gbar.dtu.dk/software-engineering-2/group-D.git) has been cloned and that `npm` is installed (we have used version 8.19.x). Furthermore the server must have `pm2` installed.

## Installing depencies
For both the client and server the force flag must be used, because some react packages did not match our npm version.
```sh
cd client
npm i --force
cd ../server-nest
npm i --force
```

## Development build
### Client
```sh
cd client
npm run start
```
### Server
```sh
cd server-nest
npm run start
```

## Testing
Only the server has tests, they can be run with the command:
```sh
cd server-nest
npm run test
```

## Production build and deployment
### Client
Everything in this section will be run in the client folder, located in the root:
```
cd client
npm run build
```
For the first time `pm2` setup run:
```sh
pm2 serve build 3000 --spa --name client
```
Afterwards run the following command whenever a new build is made:
```sh
pm2 restart client
```
### Server
Everything in this section will be run in the server folder, located in the root:
```
cd server-nest
```
First create the dotenv file
```sh
touch .env
```
Then use your preferred text editor to insert the following credentials:
```
DB_USER=<username>
DB_PASSWORD=<password>
DB_USER_POSTGIS=<username>
DB_PWD_POSTGIS='<password>
OUR_USER=<username>
OUR_PW=<password>
```
Now the server can be build and deployed
```sh
npm run build
```
For the first time `pm2` setup run:
```sh
pm2 start dist/main.js --name server
```
Afterwards run the following command whenever a new build is made:
```sh
pm2 restart server
```