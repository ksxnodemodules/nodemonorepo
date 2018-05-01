echo 'Creating .npmignore files...'

igfileman write \
  --base='.npmignore' \
  --output='.npmignore' \
  --container='packages/*/*'
