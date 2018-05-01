bash sh/test.sh || exit $?
bash sh/create-npmignore-files || exit $?
bash sh/build.sh || exit $?
