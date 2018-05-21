echo 'Install additional tools for CI...'

pnpm install --global --shamefully-flatten \
  coveralls@latest codecov@latest

exit 0 # Always success
