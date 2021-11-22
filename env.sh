set -eou pipefail

ENV="${1:-'dev'}" # dev|stage|prod

cp .env.$ENV .env