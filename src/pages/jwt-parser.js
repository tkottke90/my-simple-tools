import { copyToClipboard } from '/lib/clipboard.js'

/**
 * @typedef JWTDetails
 * @property {string} original Original string provided by the user
 * @property {string[]} parts The parts of the JWT split on the period (.) character
 * @property {number} expiration The expiration date (in ms) of the token
 * @property {object} parsed the parts of the JWT which are base64 decoded
 * @property {string | Record} parsed.header The header of the JWT
 * @property {string | Record} parsed.payload The payload of the JWT
 * @property {string | Record} parsed.signature The signature of the JWT
 * @property {number} timestamp The date/time the token was saved
 */

/** @type {JWTDetails | undefined} */
let currentInput = undefined;

/** @type {JWTDetails[]} */
const previousInputs = [];

/** @type {HTMLTextAreaElement} */
const input = document.querySelector('#input');

/** @type {HTMLDivElement} */
const jsonOutput = document.querySelector('#raw-json');

/** @type {HTMLDivElement} */
const headerOutput = document.querySelector('#header-json')

/** @type {HTMLDivElement} */
const displayOutput = document.querySelector('#payload');

/** @type {HTMLButtonElement} */
const saveBtn = document.querySelector('#save-btn');

const createIconButton = (iconName, callback) => {
  const button = document.createElement('button');
  const icon = document.createElement('span');
  
  button.addEventListener('click', callback);

  icon.classList.add('iconify');
  icon.dataset.icon = `mdi-${iconName}`

  button.appendChild(icon)

  return button;
}

/**
 * Consume a JWT String and return a JWT Details object
 * @param {string} original
 * @returns {JWTDetails} 
 */
function generateDisplayObject(original) {
  const parts = original.split('.');
  const [ header, payload, signature ] = parts.map(part => {
    try {
      return JSON.parse(atob(part));
    } catch(err) {
      return part;
    }
  });

  return {
    valid: typeof header === 'object' && typeof payload === 'object',
    original,
    parts,
    timestamp: new Date().valueOf(),
    expiration: payload.exp ? payload.exp : 0,
    parsed: {
      header,
      payload,
      signature
    }
  }
}

function renderJWTForm(details) {
  const entries = Object.entries(details);

  displayOutput.innerHTML = '';

  entries.forEach(entry => {
    const [key, value] = entry;

    const formField = document.createElement('tr');
    formField.classList.add('form-field');

    const label = document.createElement('td');
    const inputCell = document.createElement('td');
    const localInput = document.createElement('input');

    const actions = document.createElement('td');
    actions.classList.add('actions');

    const copyButton = createIconButton('content-copy', () => {
      copyToClipboard(value);
    })

    const pushButton = createIconButton('arrow-up-bold-hexagon-outline', () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      
      input.value = value;
      input.dispatchEvent(event);
    });

    actions.appendChild(copyButton);
    actions.appendChild(pushButton);

    label.innerText = key;
    localInput.value = value;
    localInput.readOnly = true;

    inputCell.appendChild(localInput);

    formField.appendChild(label);
    formField.appendChild(inputCell);
    formField.appendChild(actions);

    displayOutput.appendChild(formField);
  });
}

input.addEventListener('input', ($event) => {
  input.setCustomValidity('');


  const inputVal = input.value;
  let outputVal = "No Content";
  let headerVal = "No Content";

  const details = generateDisplayObject(inputVal);

  if (details.valid) {
    if (details.parsed.payload) {
      outputVal = JSON.stringify(details.parsed.payload, null, 2);
  
      renderJWTForm(details.parsed.payload);
    }
  
    if (details.parsed.header) {
      headerVal = JSON.stringify(details.parsed.header, null, 2);
    }
  
    jsonOutput.innerText = outputVal;
    headerOutput.innerText = headerVal;
  
    currentInput = details;

    saveBtn.disabled = false;
  } else {
    input.setCustomValidity('Invalid JWT');
    saveBtn.disabled = true;
  }

});

/**
 * Generate a table row ('tr') element with details about the saved token
 * @param {JWTDetails} tokenDetails 
 * @returns {HTMLTableRowElement}
 */
function generateSaveTokenRow(tokenDetails) {
  const timestamp = new Date();
  
  const row = document.createElement('tr');
  row.classList.add('overlay-container');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const dateCol = document.createElement('td');
  const dateElem = document.createElement('p');
  dateElem.innerText = timestamp.toLocaleDateString()

  const timeElem = document.createElement('p');
  timeElem.innerText = timestamp.toLocaleTimeString();
  
  dateCol.appendChild(dateElem);
  dateCol.appendChild(timeElem);

  const tokenCol = document.createElement('td');
  tokenCol.innerText = tokenDetails.original;
  tokenCol.classList.add('text-ellipsis');

  const expired = (tokenDetails.expiration * 1000) < timestamp.valueOf();
  const statusCol = document.createElement('td');
  const expiration = expired 
    ? createIconButton('hexagon-outline', () => {}) 
    : createIconButton('hexagon-slice-6', () => {})

    
    
  if (expired) {
    expiration.style.color = "var(--theme-warn)";
  }
  
  statusCol.appendChild(expiration);
    
  const actionsCol = document.createElement('td');
  const loadButton = createIconButton('arrow-up-bold-hexagon-outline', () => {
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    input.value = tokenDetails.original;
    input.dispatchEvent(event);
  });

  actionsCol.appendChild(loadButton);

  row.appendChild(dateCol);
  row.appendChild(tokenCol);
  row.appendChild(statusCol);
  row.appendChild(actionsCol);

  return row;
}

/** @type {HTMLDivElement} */
const previousList = document.querySelector('#previous');

function updateSavedList() {
  previousInputs
    .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
    .forEach(token => {
      const row = generateSaveTokenRow(token);

      previousList.appendChild(row);
    })
}

saveBtn.addEventListener('click', () => {
  previousList.innerHTML = '';
  const details = generateDisplayObject(input.value);
  previousInputs.push(details);
  
  updateSavedList()

  input.value = '';
  saveBtn.disabled = true;
});

/** @type {HTMLButtonElement} */
const clearBtn = document.querySelector('#clear-btn');

clearBtn.addEventListener('click', () => {
  input.value = '';
});