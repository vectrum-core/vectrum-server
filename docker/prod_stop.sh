#!/usr/bin/env bash
set -eo pipefail

docker-compose \
  --file prod/docker-compose.yml \
  down
