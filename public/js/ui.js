function showMessage(text, type = 'success') {
  const msg = document.getElementById('flashMessage');
  if (!msg) return;

  msg.textContent = text;
  msg.className = `flash ${type}`;

  setTimeout(() => {
    msg.className = 'flash';
    msg.textContent = '';
  }, 3000);
}