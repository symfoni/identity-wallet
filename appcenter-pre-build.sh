#!/usr/bin/env bash
set -euo pipefail

yarn env${SYMFONI_YARN_ENV:-''}  # ''|':stage'|':prod'
