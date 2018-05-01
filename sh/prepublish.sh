bash sh/test.sh || exit $?
bash sh/create-npmignore-files.sh || exit $?
bash sh/build.sh || exit $?
