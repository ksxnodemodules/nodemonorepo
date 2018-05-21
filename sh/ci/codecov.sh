echo 'Installing codecov...'
pnpm i -g coveralls || exit $?

echo 'Reporting coverage info...'
codecov
