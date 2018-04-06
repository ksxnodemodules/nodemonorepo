(
  export SKIP_TYPESCRIPT_COMPILATION=true
  bash 'sh/build.sh'
) && (
  echo 'Running test...'
  jest --coverage $@
  stcode=$?

  [[ $COVERALL != 'true' ]] || (
    echo 'Reporting coverage info...'
    cat ./coverage/lcov.info | coveralls
  )

  exit $stcode
)
