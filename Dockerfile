FROM postgres:17

RUN apt-get update
RUN apt-get install -y postgresql-17-wal2json

CMD ["postgres", "-c", "wal_level=logical"]
