import { SourceDetector } from '../../types'

const DEFAULT_SOURCE_DETECTOR: SourceDetector =
  ({ item }) => /\.tsx?/.test(item) && !/\.d.tsx?/.test(item)

export = DEFAULT_SOURCE_DETECTOR
