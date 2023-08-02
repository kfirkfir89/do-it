export async function validateResponse(res: Response) {
  if (!res.ok) {
    const err: { message: string; stack: string } = await res.json();
    console.log('err:', err.stack);
    throw new Error(`${err.message}`);
  }
  return res.json();
}

export async function validateResponseError(res: Response) {
  if (!res.ok) {
    const err: { message: string; stack: string } = await res.json();
    console.log('err:', err.stack);
    throw new Error(`${err.message}`);
  }
}
