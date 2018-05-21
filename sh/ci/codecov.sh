echo 'COVERAGE SERVICE: Codecov <https://codecov.io/>'

echo 'Installing codecov...'
pnpm install --global --shamefully-flatten coveralls || exit $?

echo 'Reporting coverage info...'
codecov