bash sh/prepublish.sh || exit $?

echo 'Publishing...'
nested-wrkspc publish . $@
bash sh/prepublish.sh || exit $?
nested-wrkspc.prv publish . $@
