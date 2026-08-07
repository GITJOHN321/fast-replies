export type User = {
  id_user: string
  username: string
  email: string
  status: string
  type: string
  configuration: Record<string, unknown>
}

export type Tag = {
  id_tag: string
  tagname: string
  color: string
}

export type Note = {
  id_note: string
  notename: string
  content: string
  image_url: string[]
  pin_up: boolean
  position: number
  color: string
  status: string
  favorite: boolean
  tags: string[]
}

export type Vault = {
  id_vault: string
  vaultname: string
  notes: Note[]
}
