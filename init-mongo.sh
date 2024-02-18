#!/bin/bash

echo "Checking if MongoDB is running..."
until nc -z localhost 27017; do
  echo "Waiting for MongoDB to start..."
  sleep 1
done
echo "MongoDB is running!"

echo "Creating database and collection..."
mongo <<EOF
use teste_ixc
db.createCollection("minhaColecao")
EOF
