export type Tag = {
  id: string
  name: string
}

export type Note = {
  id: string
  title: string
  description: string
  tags: string[]
}

export type Vault = {
  id: string
  title: string
  notes: Note[]
}
