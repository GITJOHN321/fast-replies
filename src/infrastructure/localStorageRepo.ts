import type { Vault, Tag } from '../domain/entities'
import type { VaultRepository } from '../domain/repositories'

export class LocalStorageVaultRepo implements VaultRepository {
  private vaultsKey: string
  private tagsKey: string

  constructor(userId: string) {
    this.vaultsKey = `vaults_${userId}`
    this.tagsKey = `tags_${userId}`
  }

  loadVaults(): Vault[] {
    const raw = localStorage.getItem(this.vaultsKey)
    return raw ? JSON.parse(raw) : []
  }

  loadTags(): Tag[] {
    const raw = localStorage.getItem(this.tagsKey)
    return raw ? JSON.parse(raw) : []
  }

  saveVaults(vaults: Vault[]): void {
    localStorage.setItem(this.vaultsKey, JSON.stringify(vaults))
  }

  saveTags(tags: Tag[]): void {
    localStorage.setItem(this.tagsKey, JSON.stringify(tags))
  }
}
