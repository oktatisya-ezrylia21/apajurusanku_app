// Jendela konfirmasi (modal). Isi HTML dikirim oleh pemanggil; tombol di dalamnya memakai data-aksi.
import { $ } from '../inti/util.js';

export function bukaModal(htmlIsi) {
  $('modal').innerHTML = `<div class="panel" role="dialog" aria-modal="true">${htmlIsi}</div>`;
  $('modal').classList.add('tampil');
}

export function tutupModal() {
  $('modal').classList.remove('tampil');
  $('modal').innerHTML = '';
}
