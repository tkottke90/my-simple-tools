const appName = "Simple Tools";

/** @type {HTMLIFrameElement} */
const displayFrame = document.querySelector('iframe');

/** @type {NodeListOf<HTMLButtonElement>} */
const navButtons = document.querySelectorAll('nav > .buttons > button');
const backButton = document.querySelector('#back-btn');

/** @type {HTMLDivElement} */
const routerOutlet = document.querySelector('#router-outlet');

backButton.addEventListener('click', () => {
  displayFrame.src = '';
  routerOutlet.removeAttribute('show');
});

// Register navigation events with each button
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const src = button.dataset.src || '';

    document.title = `${appName}: ${button.innerText}`
    routerOutlet.setAttribute('show', '');
    displayFrame.src = src;
  });
});

