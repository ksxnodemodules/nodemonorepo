echo 'Installing coveralls...'
pnpm i -g coveralls || exit $?

echo 'Reporting coverage info...'
cat ./coverage/lcov.info | coveralls
