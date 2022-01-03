import 'https://unpkg.com/lodash@4.17.21/lodash.js';
import { fakerFactory } from '/lib/faker-factory.js'


function getTemplateInstance(name) {
  return document
    .querySelector(`template${name}`)
    .cloneNode(true)
    .content;
}

/**
 * @typedef {{ [key: string]: string }} StringKeyValueStore
 */

/**
 * @typedef {Object} FieldSet
 * @property {() => StringKeyValueStore} value
 * @property {() => StringKeyValueStore} generate
 */

function renderFakerField(options, index) {
  const fieldset = getTemplateInstance('#field-group');
  const group = fieldset.querySelector('tr');
  group.dataset.index = index;

  const nameInput = fieldset.querySelector('input#name');
  const typeSelect = fieldset.querySelector('select');

  nameInput.name = `name`

  typeSelect.name = `type`
  typeSelect.appendChild(options);
  typeSelect.value = "fake";

  const deleteBtn = fieldset.querySelector('#delete-field');

  /**
   * Gets the faker type key
   * @returns {StringKeyValueStore} The schema key with the faker function name
   */
  group.value = () => {
    return ({ [nameInput.value]: typeSelect.value });
  }

  /**
   * Runs the faker function and returns the value assigned to the schema
   * @returns {StringKeyValueStore} The schema as a key with an returned value from the faker function call
   */
  group.generate = () => {
    const method = fakerInstance.methods.get(typeSelect.value);

    try {
      if (method) {
        return ({ [nameInput.value]: method.call(this) })
      }
    } catch (err) {
      return ({ [nameInput.value]: err.message })
    }
  }

  return [fieldset, typeSelect, nameInput, deleteBtn];
}

const fakerInstance = fakerFactory();

const temp = [];
fakerInstance.keys()
  .forEach(key => temp.push([key, {}]));

// console.log(JSON.stringify(temp, null, 2));

/** @type {HTMLButtonElement} */
const addBtn = document.querySelector('button#add');

addBtn.addEventListener('click', () => {
  const options = fakerInstance.options.cloneNode(true);
  const index = form.dataset.index || (form.children.length - 1);

  form.dataset.index = Number(index) + 1;

  const [formField, select, input, deleteBtn] = renderFakerField(options, index);
  formFields.appendChild(formField);

  actionBtns.forEach(btn => btn.disabled = false);

  select.value = fakerInstance.methods[0];
  select.addEventListener('input', e => {
    e.preventDefault();

    const action = fakerInstance.methods.get(e.target.value)

    // console.dir(action);
    // console.table({
    //   desc: action.description(),
    //   samples: action.samples(),
    //   action: action.action.toString()
    // })
  });
  input.focus();

  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const field = formFields.querySelector(`tr[data-index="${index}"]`);
    formFields.removeChild(field);

    if (formFields.querySelectorAll('tr').length === 0) {
      actionBtns.forEach(btn => btn.disabled = true);
    }
  })
})

/** @type {HTMLFormElement} */
const form = document.querySelector('form#schema');
const formFields = form.querySelector('tbody')

const fieldNameRegex = /\w\[(\d)\]/;
function parseFormValues(element) {

}

function generateDataEntry(seed = {}) {
  /** @type {FieldSet[]} */
  const fieldSets = Array.from(form.querySelectorAll('tr[data-index]'));

  const generateResult = fieldSets.map(set => set.generate());
  return Object.assign(seed, ...generateResult)
}

/** @type {Array<HTMLButtonElement>} */
const actionBtns = Array.from(document.querySelectorAll('#actions > button'));

/** @type {HTMLButtonElement} */
const testBtn = document.querySelector('#actions > button#test')
testBtn.addEventListener('click', () => {
  let output = "";
  if (form.checkValidity()) {
    output = generateDataEntry();
    code.innerHTML = JSON.stringify(output, null, 2);
  } else {
    const elements = Array.from(form.elements).filter(elem => elem.name);
    elements.forEach(/** @type {HTMLInputElement} */ elem => {
      const valid = elem.checkValidity();

      if (!valid) {
        const error = elem.nextElementSibling;

        error.innerText = elem.validationMessage;
      }
    })
  }
});

/** @type {HTMLButtonElement} */
const generateBtn = document.querySelector('#actions > button#generate')
generateBtn.addEventListener('click', () => {
  code.innerText = "";

  const prompt = Number(window.prompt('How Many To Make?'));

  if (prompt) {
    let output = [];

    for (let i = 0; i < prompt; i++) {
      output.push(generateDataEntry());
    }

    code.innerText = JSON.stringify(output, null, 2);
    console.dir(code.innerText);
  }
});

/** @type {HTMLButtonElement} */
const saveBtn = actionBtns.find(btn => btn.id = 'save');

/** @type {HTMLElement} */
const code = document.getElementById('code');