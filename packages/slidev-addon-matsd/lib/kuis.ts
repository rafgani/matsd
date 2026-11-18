import { computed, reactive, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

export interface Hasil { benar: boolean, jawaban: unknown }

const KUNCI = 'matsd-kuis-v1'

function muat(): Record<string, Hasil> {
  try {
    return JSON.parse(localStorage.getItem(KUNCI) || '{}')
  }
  catch {
    return {}
  }
}

const store = reactive<Record<string, Hasil>>(typeof window === 'undefined' ? {} : muat())

watch(store, () => {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(store))
  }
  catch {}
}, { deep: true })

/** Namespace = `kuisId` di headmatter deck (fallback: judul deck). */
export function useNamespace() {
  const { $slidev } = useSlideContext()
  const c = $slidev?.configs as any
  return String(c?.kuisId || c?.title || 'matsd')
}

/** Simpan / baca hasil satu soal. */
export function useSoal(id: string) {
  const ns = useNamespace()
  const kunci = `${ns}/${id}`
  const hasil = computed(() => store[kunci])
  return {
    hasil,
    simpan: (jawaban: unknown, benar: boolean) => { store[kunci] = { jawaban, benar } },
    hapus: () => { delete store[kunci] },
  }
}

/** Rekap soal dalam deck ini yang id-nya diawali `awalanId` (default "kuis"). */
export function useRekap(awalanId = 'kuis') {
  const ns = useNamespace()
  const awalan = `${ns}/${awalanId}`
  const entri = computed(() => Object.entries(store).filter(([k]) => k.startsWith(awalan)))
  return {
    dijawab: computed(() => entri.value.length),
    benar: computed(() => entri.value.filter(([, v]) => v.benar).length),
    reset: () => { for (const [k] of entri.value) delete store[k] },
  }
}

/** Samakan jawaban isian: abaikan spasi/huruf besar, koma = titik desimal. */
export function samakan(a: unknown, b: unknown) {
  const norm = (x: unknown) => String(x).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.')
  const na = norm(a)
  const nb = norm(b)
  if (na !== '' && nb !== '' && !Number.isNaN(Number(na)) && !Number.isNaN(Number(nb)))
    return Math.abs(Number(na) - Number(nb)) < 1e-9
  return na === nb
}

/** Acak deterministik (tetap sama di layar & PDF). */
export function acak<T>(arr: T[], seed: string): T[] {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
