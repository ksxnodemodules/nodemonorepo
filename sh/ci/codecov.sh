echo 'COVERAGE SERVICE: Codecov <https://codecov.io/>'

echo 'Installing codecov...'
pnpm install --global --shamefully-flatten codecov || exit $?

echo 'Reporting coverage info...'
codecov
