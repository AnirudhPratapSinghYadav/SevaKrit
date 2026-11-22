/**
 * Race a promise against a timeout (Nagarakshak queryWithTimeout pattern).
 * Prevents stuck Supabase calls from blocking UI forever.
 */
export async function queryWithTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label = "Request",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`${label} timed out after ${ms}ms.`));
        }, ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
