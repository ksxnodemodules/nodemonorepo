echo 'Reporting coverage information...'
stcode=0

echo '  → To Coveralls <https://coveralls.io/>'
cat ./coverage/lcov.info | coveralls
((stcode|=$?))

echo '  → To Codecov <https://codecov.io/>'
codecov
((stcode|=$?))

echo 'Diffing lock file...'
echo '  → shrinkwrap.yaml ≏ shrinkwrap.yaml.old.tmp'
diff --color=always shrinkwrap.yaml shrinkwrap.yaml.old.tmp

exit $stcode
