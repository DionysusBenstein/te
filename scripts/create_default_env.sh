#! /bin/sh

services=(marketprice matchengine readhistory router websocket)

for i in "${services[@]}"
do
    cp ./$i/sample.env ./$i/.env
    echo "$i --> done"
done
