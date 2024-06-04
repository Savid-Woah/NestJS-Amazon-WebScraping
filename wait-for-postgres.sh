#!/bin/sh

POSTGRES_HOST=postgres
POSTGRES_PORT=5432

until nc -z $POSTGRES_HOST $POSTGRES_PORT; do
    echo "Waiting for PostgreSQL to start..."
    sleep 1
done

echo "PostgreSQL is up and running!"

exec "$@"