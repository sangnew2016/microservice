# run image with port out 3000

# docker service create --replicas 1 --name movies-service -l=apiRoute='/movies' -p 3000:3000 crizstian/movies-service
docker run --name movie-service -p 3000:3000 -e DB_SERVERS="localhost:27017" -d movies-service
