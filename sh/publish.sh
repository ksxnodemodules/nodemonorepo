bash sh/prepublish.sh || exit $?
nested-wrkspc.prv publish . $@
