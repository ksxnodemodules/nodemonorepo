bash sh/create-npmignore-files.sh || exit $?
bash sh/mismatched-versions.sh || exit $?
bash sh/test.sh --ci || exit $?
bash sh/build.sh || exit $?
