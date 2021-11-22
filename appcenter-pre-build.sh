#!/usr/bin/env bash
set -euo pipefail

yarn env:${SYMFONI_ENV:-'dev'}  # dev|stage|prod
