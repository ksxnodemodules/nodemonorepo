bash sh/prepublish.sh || exit $?

echo 'Publishing packages...'
nested-wrkspc.prv publish . $@
