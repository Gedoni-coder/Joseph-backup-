export default async function retry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.error(
      `DB connection failed. Retrying in ${delayMs}ms... (${retries} left)`
    );

    await new Promise((res) => setTimeout(res, delayMs));

    return retry(fn, retries - 1, delayMs * 2); // exponential backoff
  }
}
