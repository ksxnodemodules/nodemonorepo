preloaded-node 'sh/clean-typescript-build'

if [[ $SKIP_TYPESCRIPT_COMPILATION == 'true' ]]
  then
    echo 'Skip TypeScript compilation'
  else(
    echo 'Running TypeScript compiler...'
    cp 'tsconfig.json' 'packages/typescript'
    cd 'packages/typescript'
    tsc
  )
fi
