import {Traverse} from 'fs-tree-utils'
import {listManifestFiles} from '../../index'
import createFileChooser from '../../lib/.utils/file-chooser'
import FileChooser = createFileChooser.FileChooser
import DeepFunc = listManifestFiles.DeepFunc
import DEFAULT_FILE_CHOOSER = listManifestFiles.DEFAULT_FILE_CHOOSER
import DEFAULT_DEEP_FUNCTION = listManifestFiles.DEFAULT_DEEP_FUNCTION

export const chooseTypeScript =
  (param: FileChooser.Param): FileChooser.Result =>
    param.item === 'task.ts' ? 'module' : DEFAULT_FILE_CHOOSER(param)

export const ignoreCustomDeepFunc: DeepFunc = param =>
  param.item !== 'custom-deep-func' && DEFAULT_DEEP_FUNCTION(param)

export {Traverse}
