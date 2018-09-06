import {GITHUB_SHORTHAND} from '../../../index'

namespace samples {
  export const toSatify = [
    'org/repo',
    'org/repo#hash',
    'org/repo#hash/tag',
    'org-name/repo-name',
    'org-name/repo-name#commit-hash',
    'org-name/repo-name#commit-hash/tag-name',
    'org_name/repo_name',
    'org_name/repo_name#commit_hash',
    'org_name/repo_name#commit_hash/tag_name',
    'org.name/repo.name',
    'org.name/repo.name#commit.hash',
    'org.name/repo.name#commit.hash/tag.name',
    'org123/repo456',
    'org123/repo456#hash789',
    'org123/repo456#hash789/tag',
    'Org/Repo',
    'Org/Repo#Hash',
    'Org/Repo#Hash/Tag',
    'ORG/REPO',
    'ORG/REPO#HASH',
    'ORG/REPO#HASH/TAG'
  ]

  export const toUnsatify = [
    'notARepo',
    'Hello, World!!',
    'generic-package-name',
    'git+https://github.com/org/repo.git',
    'https://someserver/somepage/tarball.tgz'
  ]
}

const getReceived =
  (list: ReadonlyArray<string>) =>
    list.map(text => [text, GITHUB_SHORTHAND.test(text)] as [string, boolean])

const getExpected =
  <X extends boolean>(list: ReadonlyArray<string>, expectation: X) =>
    list.map(text => [text, expectation] as [string, X])

const createTester =
  <X extends boolean>(list: ReadonlyArray<string>, expectation: X) =>
    () => expect(getReceived(list)).toEqual(getExpected(list, expectation))

it('should emits true', createTester(samples.toSatify, true))
it('should emits false', createTester(samples.toUnsatify, false))
