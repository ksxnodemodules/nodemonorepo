if [[ $SKIP_TYPESCRIPT_COMPILATION == 'true' ]]
  then
    echo 'Skip TypeScript compilation'
  else
    echo 'Running TypeScript compiler...'
    tsc
fi
