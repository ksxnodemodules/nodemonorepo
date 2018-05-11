import git from '../.utils/git-cli'

/**
 * Repository manager
 */
export class Repository {
  /**
   * Directory that contains repository (contains `.git` directory)
   */
  readonly location: string

  /**
   * Shortcut to execute git command in repository
   */
  readonly execute: Repository.BindedGit

  /**
   * @param location Directory of repository
   */
  constructor (location: string) {
    this.location = location
    this.execute = (args, options) => git(location, args, options)
  }

  /**
   * Tags manager
   */
  get tags () {
    return new Repository.Tags(this.location)
  }
}

export namespace Repository {
  /**
   * SubCommand executor (abstract)
   */
  export abstract class SubCmd extends Repository {
    protected abstract readonly subCmdName: string

    /**
     * Shortcut to execute git subcommand
     */
    readonly command: Repository.BindedGit

    /**
     * @param location Directory of repository
     */
    constructor (location: string) {
      super(location)
      const {execute} = this
      this.command = (args, options) => execute([this.subCmdName, ...args], options)
    }
  }

  /**
   * Tags manager
   */
  export class Tags extends SubCmd {
    readonly subCmdName = 'tag'

    /**
     * Get all tags in repository
     */
    getAllTags () {
      return this.command([]).split(/\n|\r/).filter(Boolean)
    }

    /**
     * Add tag to current commit
     * @param name Tag name
     */
    addTag (name: string) {
      this.command([name])
    }
  }

  export type BindedGit = (args: git.Argv, options?: git.Options) => git.Result
}

export default Repository
