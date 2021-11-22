#!/usr/bin/env bash
set -euo pipefail

echo "appcenter-post-clone.sh: Copy .env.${SYMFONI_ENV:-'dev'} -> .env"
./env.sh ${SYMFONI_ENV:-'dev'}
