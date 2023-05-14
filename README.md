# Project Typescript | Expressjs | Sequelize


## Project Setup

```sh
copy __.env.example__ file to __.env__ and edit database credentials there
```

```sh
npm install
```

__Migration Table__


```sh
npx sequelize-cli db:migrate
```

```sh
npx sequelize-cli db:migrate:undo
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

```sh
npm run ts
```

### Compile and Minify for Production

```sh
npm run tsc
```

