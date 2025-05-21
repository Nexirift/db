# Use the latest official PostgreSQL image as the base
# This image is typically based on Debian/Ubuntu, making apt-get usable
FROM postgres:latest

# Set environment variables for logical decoding configuration
# These can also be configured via a mounted postgresql.conf
ENV WAL_LEVEL="logical" \
    MAX_REPLICATION_SLOTS=10 \
    MAX_WAL_SENDERS=10

# Install wal2json using apt-get
# The package name is typically 'postgresql-XX-wal2json' where XX is the PG major version
# We need to determine the PG_MAJOR version dynamically or explicitly for the package name.
# The `postgres:latest` image usually sets PG_MAJOR in its environment.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-$PG_MAJOR-wal2json && \
    rm -rf /var/lib/apt/lists/*

# Configure PostgreSQL to enable logical decoding
# This uses the environment variables set earlier.
# The default entrypoint for the postgres image will pick up these settings
# if placed in the appropriate configuration file.
# We'll append to postgresql.conf.sample, which is used by the entrypoint
# to initialize the database if it doesn't exist.
RUN echo "wal_level = ${WAL_LEVEL}" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "max_replication_slots = ${MAX_REPLICATION_SLOTS}" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "max_wal_senders = ${MAX_WAL_SENDERS}" >> /usr/share/postgresql/postgresql.conf.sample

# Optional: If you want wal2json to be preloaded (convenient but not always necessary)
# Uncomment the line below. You would usually do this for specific use cases
# where you know wal2json will always be needed for every database.
# Otherwise, create the extension with `CREATE EXTENSION wal2json;` in your database.
RUN echo "shared_preload_libraries = 'wal2json'" >> /usr/share/postgresql/postgresql.conf.sample

# Expose the default PostgreSQL port (already done by base image, but good practice)
EXPOSE 5432

# The default ENTRYPOINT and CMD from the base PostgreSQL image are sufficient
# ENTRYPOINT ["docker-entrypoint.sh"]
# CMD ["postgres"]
