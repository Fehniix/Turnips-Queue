# Run Instructions

The Docker mount volume for the official Postgres Docker image is `./database-mount`. It has to be located at **root level**, parallel to `src`, `target` etc.

## Docker run command

Windows: `docker run --rm -p 5432:5432 --name acnh-turnips-db --mount type=bind,source="%cd%"/database-mount,dst=/var/lib/postgresql/data -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root postgres`
Linux/MacOS: `docker run --rm -p 5432:5432 --name acnh-turnips-db --mount type=bind,source="$(pwd)"/database-mount,dst=/var/lib/postgresql/data -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root postgres`
