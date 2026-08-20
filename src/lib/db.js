import { openDB } from 'idb'

const DB_NAME = 'kindermeilensteine'
const DB_VERSION = 1

let _db = null

async function getDB() {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Children store
      if (!db.objectStoreNames.contains('children')) {
        const childStore = db.createObjectStore('children', { keyPath: 'id' })
        childStore.createIndex('owner_id', 'owner_id')
      }
      // Entries store
      if (!db.objectStoreNames.contains('entries')) {
        const entryStore = db.createObjectStore('entries', { keyPath: 'id' })
        entryStore.createIndex('child_id', 'child_id')
        entryStore.createIndex('sync_status', 'sync_status')
      }
      // Child members store
      if (!db.objectStoreNames.contains('child_members')) {
        db.createObjectStore('child_members', { keyPath: 'id' })
      }
    },
  })
  return _db
}

// ─── Children ────────────────────────────────────────────────────────────────

export async function getLocalChildren() {
  const db = await getDB()
  return db.getAll('children')
}

export async function saveLocalChild(child) {
  const db = await getDB()
  await db.put('children', child)
}

export async function deleteLocalChild(id) {
  const db = await getDB()
  await db.delete('children', id)
}

// ─── Entries ─────────────────────────────────────────────────────────────────

export async function getLocalEntries(childId) {
  const db = await getDB()
  const all = await db.getAllFromIndex('entries', 'child_id', childId)
  return all.sort((a, b) => new Date(b.datum) - new Date(a.datum))
}

export async function saveLocalEntry(entry) {
  const db = await getDB()
  await db.put('entries', { ...entry, sync_status: entry.sync_status || 'pending' })
}

export async function updateLocalEntrySync(id) {
  const db = await getDB()
  const entry = await db.get('entries', id)
  if (entry) {
    await db.put('entries', { ...entry, sync_status: 'synced' })
  }
}

export async function getPendingEntries() {
  const db = await getDB()
  return db.getAllFromIndex('entries', 'sync_status', 'pending')
}

export async function deleteLocalEntry(id) {
  const db = await getDB()
  await db.delete('entries', id)
}

// ─── Bulk save (from Supabase sync) ──────────────────────────────────────────

export async function bulkSaveChildren(children) {
  const db = await getDB()
  const tx = db.transaction('children', 'readwrite')
  await Promise.all(children.map(c => tx.store.put(c)))
  await tx.done
}

export async function bulkSaveEntries(entries) {
  const db = await getDB()
  const tx = db.transaction('entries', 'readwrite')
  await Promise.all(entries.map(e => tx.store.put({ ...e, sync_status: 'synced' })))
  await tx.done
}
