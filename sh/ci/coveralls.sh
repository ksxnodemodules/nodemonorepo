echo 'COVERAGE SERVICE: Coveralls <https://coveralls.io/>'

echo 'Installing coveralls...'
pnpm install --global --shamefully-flatten coveralls || exit $?

echo 'Reporting coverage info...'
cat ./coverage/lcov.info | coveralls
