#!/bin/bash

echo "Running knex migrations"

# Run the migration command
npx knex migrate:latest

# Capture the exit status
exit_status=$?

if [ $exit_status -ne 0 ]; then
  echo "Error running knex migrations"
else
  echo "Knex migrations ran successfully"
fi

exit $exit_status