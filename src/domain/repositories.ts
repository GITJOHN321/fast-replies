import type { Vault, Tag } from './entities'

export interface VaultRepository {
  loadVaults(): Vault[]
  loadTags(): Tag[]
  saveVaults(vaults: Vault[]): void
  saveTags(tags: Tag[]): void
}
