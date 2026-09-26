# Mongo Journal API

![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-Node.js-339933?logo=nodedotjs&logoColor=white)
![Zod](https://img.shields.io/badge/validation-Zod-3E67B1)

API de **diario personal** con **MongoDB** (índices, aggregations, Zod).

## Stack
Node · Express · Mongoose · Zod · Docker Compose (Mongo 7)

## Arranque
```bash
docker compose up -d
npm install
npm run dev
```

## Endpoints
- `GET /health`
- `GET /entries?mood=&tag=`
- `POST /entries`
- `GET/DELETE /entries/:id`
- `GET /stats` — agregación por mood

## Autora
**Juliana Chantre Astudillo** · [GitHub](https://github.com/jchantre-jpg)
