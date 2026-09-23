import { fal } from "@fal-ai/client";

export async function runFal<T>(key: string, model: string, input: Record<string, unknown>): Promise<T> {
  fal.config({ credentials: key });
  const result = await fal.subscribe(model, { input, logs: false });
  return result.data as T;
}

export async function falUpload(key: string, buffer: Buffer, name: string, type: string): Promise<string> {
  fal.config({ credentials: key });
  return fal.storage.upload(new File([new Uint8Array(buffer)], name, { type }));
}
