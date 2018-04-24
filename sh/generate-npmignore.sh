echo 'Generating .npmignore files...'

igfileman write \
  --base='.npmignore' \
  --root='packages' \
  --output='.npmignore' \
  --container='packages/*/*'
