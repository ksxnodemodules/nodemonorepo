bash sh/prepublish.sh || exit $?

echo 'Publishing packages...'
nested-wrkspc.prv publish . $@
stcode=$?

bash sh/postpublish.sh || echo "postpublish exited with code $?"

exit $stcode
