echo 'Install additional tools for CI...'

pnpm install --global --shamefully-flatten \
  coveralls codecov

exit 0 # Always success
