FROM postgres
RUN apk --no-cache add mariadb mariadb-client

VOLUME /var/lib/postgres
EXPOSE 5432

RUN mkdir /docker-entrypoint-initdb.d
COPY init.sql /docker-entrypoint-initdb.d

CMD ["pg_ctl start -l logfile"]