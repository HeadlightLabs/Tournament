#!/bin/bash

if [ -z "$SERVER_HOST" ]
then
  export SERVER_HOST="headlight-tournament-5.herokuapp.com"
fi

if [ -z "$SERVER_PORT" ]
then
  export SERVER_PORT="80"
fi

python3 ./mars/bin.py
