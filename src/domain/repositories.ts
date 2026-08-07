import type { Vault, Tag } from './entities'

export interface VaultRepository {
  loadVaults(): Vault[] | Promise<Vault[]>
  loadTags(): Tag[] | Promise<Tag[]>
  saveVaults(vaults: Vault[]): void | Promise<void>
  saveTags(tags: Tag[]): void | Promise<void>
}
