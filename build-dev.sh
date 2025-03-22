#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Build the package
echo "Building package..."
bun run build

# Copy distribution files to dependent projects
echo "Copying distribution files..."
for project in ../cosmos ../nova; do
  mkdir -p "$project/node_modules/@nexirift/db"
  cp -R dist "$project/node_modules/@nexirift/db"
done

# Generate and migrate database in cosmos project
echo "Running database operations in cosmos..."
cd ../cosmos
bun run db:generate
bun run db:migrate

# Copy migrations to nova project
echo "Syncing migrations to nova..."
cp -R node_modules/@nexirift/db/migrations ../nova/node_modules/@nexirift/db

# Launch database studio
echo "Starting database studio..."
bun run db:studio
