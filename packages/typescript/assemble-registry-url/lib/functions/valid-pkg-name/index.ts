import {PKG_NAME_REGEX} from '../../constants'
export = (name: string) => PKG_NAME_REGEX.test(name)
