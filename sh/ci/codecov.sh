echo 'COVERAGE SERVICE: Codecov <https://codecov.io/>'

echo 'Installing codecov...'
pnpm i -g coveralls || exit $?

echo 'Reporting coverage info...'
codecov
