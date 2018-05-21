(
  export SKIP_TYPESCRIPT_COMPILATION=true
  bash 'sh/build.sh'
) && (
  echo 'Running test...'
  jest --coverage $@
)
