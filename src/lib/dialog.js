/** @type {NodeListOf<HTMLDivElement>} */
const dialogs = document.querySelectorAll('div.dialog');

dialogs.forEach(/** @type {HTMLDivElement} */(dialog) => {
  // Get content
  const content = dialog.querySelector('.dialog-content');

  if (!content) {
    dialog.innerHTML = "";
    return;
  }

  // Add Scrim
  const scrim = document.createElement('div');
  scrim.classList.add('scrim');

  scrim.addEventListener('click', () => {
    if (!dialog.classList.contains('noClickToHide')) {
      dialog.classList.remove('show');
    }
  });

  dialog.insertBefore(scrim, content);
});