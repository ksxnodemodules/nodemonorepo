export type TargetFunction<Return> = () => Return

interface Success<Result> {
  readonly thrown: false
  readonly result: Result
}

interface Failure<Error> {
  readonly thrown: true
  readonly error: Error
}

type ExecutionReport<Result, Error> = Success<Result> | Failure<Error>

export class FunctionMatchers<Return = any> {
  constructor (private fn: TargetFunction<Return>) {}

  private execute (): ExecutionReport<Return, any> {
    try {
      return { thrown: false, result: this.fn() }
    } catch (error) {
      return { thrown: true, error }
    }
  }

  private match<E, R> (
    handleFailure: (error: any) => E,
    handleSuccess: (value: Return) => R
  ) {
    const report = this.execute()
    return report.thrown ? handleFailure(report.error) : handleSuccess(report.result)
  }

  public get throws () {
    return this.match(x => expect(x), value => {
      throw new Error(
        `Expecting the matched function to throw an error, but it returns a value: ${value}`
      )
    })
  }

  public get returns () {
    return this.match(error => {
      throw new Error(
        `Expecting the matched function to return a value, but it throws an error: ${error}`
      )
    }, x => expect(x))
  }
}

export function expectFunction<Return = any> (fn: TargetFunction<Return>) {
  return new FunctionMatchers(fn)
}

export default expectFunction
