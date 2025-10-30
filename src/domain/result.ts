export class Result<T, E = Error> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: E,
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  map<U>(fn: (value: T) => U): Result<U, any> {
    if (!this.isSuccess || this.value === undefined)
      return Result.fail(this.error!);
    try {
      return Result.ok(fn(this.value));
    } catch (err: any) {
      return Result.fail(err);
    }
  }

  async andThen<U>(
    fn: (value: T) => Promise<Result<U, E>>,
  ): Promise<Result<U, E>> {
    if (!this.isSuccess || this.value === undefined)
      return Result.fail(this.error!);
    try {
      return await fn(this.value);
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
