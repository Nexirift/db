#!/bin/bash

rm -f migrations/\*.sql
rm -rf migrations/meta
docker exec -ti nexirift-postgres dropdb -U postgres -f 'nexirift'
docker exec -ti nexirift-postgres createdb -U postgres 'nexirift'
