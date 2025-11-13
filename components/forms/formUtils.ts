export function getValue(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

export function getOptionalValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)?.toString().trim();
  return value ? value : undefined;
}
