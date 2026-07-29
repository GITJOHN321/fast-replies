export type ImportPayload = {
  title: string
  notes: { title: string; description: string; tags: string[] }[]
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null)
    throw new Error(`Invalid file: ${label} must be an object.`)
  return value as Record<string, unknown>
}

function assertString(obj: Record<string, unknown>, key: string, label: string): string {
  const value = obj[key]
  if (typeof value !== 'string' || value.trim() === '')
    throw new Error(`Invalid file: ${label} must be a non-empty string.`)
  return value
}

function assertOptionalString(obj: Record<string, unknown>, key: string, label: string): string {
  const value = obj[key]
  if (typeof value !== 'string')
    throw new Error(`Invalid file: ${label} must be a string.`)
  return value
}

function assertArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value))
    throw new Error(`Invalid file: ${label} must be an array.`)
  return value
}

function assertStringArray(obj: Record<string, unknown>, key: string, label: string): string[] {
  const value = obj[key]
  if (!Array.isArray(value) || value.some((t) => typeof t !== 'string'))
    throw new Error(`Invalid file: ${label} must be an array of strings.`)
  return value as string[]
}

export function parseImportFile(json: unknown): ImportPayload {
  const data = assertObject(json, 'root')
  const vault = assertObject(data.vault, 'vault')
  const title = assertString(vault, 'title', 'vault title')
  const rawNotes = assertArray(data.notes, 'notes')

  const notes: ImportPayload['notes'] = rawNotes.map((note, i) => {
    const n = assertObject(note, `note at index ${i}`)
    return {
      title: assertOptionalString(n, 'title', `note at index ${i} title`),
      description: assertOptionalString(n, 'description', `note at index ${i} description`),
      tags: assertStringArray(n, 'tags', `note at index ${i} tags`),
    }
  })

  return { title: title.trim(), notes }
}
