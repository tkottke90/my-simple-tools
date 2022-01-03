import 'https://unpkg.com/lodash@4.17.21/lodash.js';
import 'https://unpkg.com/faker@5.5.3/dist/faker.js';

/**
 * @typedef {'text' | 'number' | 'date' | 'datetime-local'} HTMLInputTypes
 */

/**
 * @callback SchemaArgumentParser
 * @param {string} argument the argument to be parsed
 */

/**
 * @typedef SchemaArgument
 * @property {string} label The label to be displayed alongside the input
 * @property {SchemaArgumentParser} parser The callback function to call to convert the input into the expected format
 */

/**
 * @typedef Schema
 * @property {string} name The label to be displayed alongside the input
 * @property {function} action The function that is called to create the fake data
 * @property {number} size The number of arguments the action is expecting
 * @property {SchemaArgument[]} arguments The configuration of what each argument looks like
 * @property {string} ref URL to the file in the Faker Github repo
 * @property {HTMLOptionElement} element Reference to the option element
 * 
 */

/**
 * Defines an argument that a faker function will take and how it should parse the input from the 
 * html input element so that the function will accept it.  Ex. Ensuring that faker.mersenne.seed
 * is passed a Number as its first argument
 * @param {string} label The label to be displayed with the input
 * @param {SchemaArgumentParser} type Type of input that should be rendered
 * @returns {SchemaArgument}
 */
function createArgument(label, type) {
  return ({ label, type })
}

/**
 * @typedef FakerFunction
 * @property {function} action Function from the faker library that is triggered by a specific function
 * @property {string} [description] Description of the function from faker implementation
 * @property {string[]} [samples] List of example outputs from the function
 */
export function fakerFactory() {

  /** @type {Map<string, Schema>} */
  const methods = new Map();
  const options = document.createDocumentFragment();

  /**
   * Pull a key from the faker object and map it to the methods
   * map for easy lookup.
   * @param {string} key String representing a path to the 
   * @param {DocumentFragment | HTMLOptGroupElement} group Element to append the child group to
   */
  const parseKey = (key, group) => {

    const property = _.get(faker, key, null);

    switch (typeof property) {
      case 'function':
        // Ignore Root Function Keys, These are either much more complicated functions OR just metadata
        if (key.split('.').length <= 1) {
          return;
        }

        const label = key.split('.').pop();
        const option = document.createElement('option');

        option.innerText = label;
        option.value = key;

        let fakerFunction = {
          name: label,
          action: property,
          size: property.length,
          arguments: [],
          ref: `https://github.com/Marak/faker.js/tree/master/lib/${group.label}.js`,
          element: option,
          set label(newLabel) {
            this.element.innerText = newLabel;
          },
          call: function (thisArg, ...args) {
            return this.action.call(this, ...args)
          },
          description: function () {
            return this.action.schema || `Creates a ${label}`;
          },
          samples: function () {
            return this.action.description;
          }
        }

        if (argumentMapOverrides.has(key)) {
          const override = argumentMapOverrides.get(key);
          if (typeof override === 'function') {
            fakerFunction = override.call(this, fakerFunction);

          } else {
            fakerFunction = Object.assign(fakerFunction, override);

            if (override.name) {
              fakerFunction.label = override.name;
            }
          }
        }

        // Allow the faker function to return null and exclude a specific key
        if (fakerFunction) {
          methods.set(key, fakerFunction);
          group.appendChild(option);
        }

        break;
      case 'object':
        const optgroup = document.createElement('optgroup');
        optgroup.label = key.slice(0, 1).toUpperCase() + key.slice(1);

        _.keys(property)
          .sort()
          .forEach(childKey => parseKey(`${key}.${childKey}`, optgroup));

        group.appendChild(optgroup);
        break;
    }
  }

  const rootKeys = _.keys(faker)
    .filter(key => !key.startsWith('local') && key !== 'definitions')
    .sort();

  rootKeys.forEach(k => parseKey(k, options));

  return ({
    keys: function () { return Array.from(this.methods.keys()) },
    methods,
    options,
    add: function (key, method) {

      this.methods.set(key, method);
    }
  })
}

/**
 * Notate a specific faker key as excluded
 * @param {SchemaTransform} fakerFn 
 * @returns {null}
 */
function excludeFakerFn(fakerFn) {
  return null;
}

/**
 * @callback SchemaTransform
 * @param {Schema} fakerFn The schema to be manipulated
 * @returns {Schema}
 */

/** @type {Map<string, Partial<Schema> | SchemaTransform>} */
const argumentMapOverrides = new Map([
  [
    "address.cardinalDirection",
    {}
  ],
  ['address.city', { name: 'City', arguments: [createArgument('Format', String)] }],
  [
    "address.cityName",
    { name: 'City Name' }
  ],
  ["address.cityPrefix", excludeFakerFn],
  ["address.citySuffix", excludeFakerFn],
  [
    "address.country",
    { name: 'Country' }
  ],
  [
    "address.countryCode",
    { name: 'Country Code' }
  ],
  [
    "address.county",
    {}
  ],
  ['address.direction', { name: 'Direction' }],
  [
    "address.latitude",
    {}
  ],
  [
    "address.longitude",
    {}
  ],
  [
    "address.nearbyGPSCoordinate",
    {}
  ],
  [
    "address.ordinalDirection",
    {}
  ],
  [
    "address.secondaryAddress",
    {}
  ],
  [
    "address.state",
    {}
  ],
  [
    "address.stateAbbr",
    {}
  ],
  [
    "address.streetAddress",
    {}
  ],
  [
    "address.streetName",
    {}
  ],
  [
    "address.streetPrefix",
    {}
  ],
  [
    "address.streetSuffix",
    {}
  ],
  [
    "address.timeZone",
    {}
  ],
  [
    "address.zipCode",
    {}
  ],
  [
    "address.zipCodeByState",
    {}
  ],
  [
    "animal.bear",
    {}
  ],
  [
    "animal.bird",
    {}
  ],
  [
    "animal.cat",
    {}
  ],
  [
    "animal.cetacean",
    {}
  ],
  [
    "animal.cow",
    {}
  ],
  [
    "animal.crocodilia",
    {}
  ],
  [
    "animal.dog",
    {}
  ],
  [
    "animal.fish",
    {}
  ],
  [
    "animal.horse",
    {}
  ],
  [
    "animal.insect",
    {}
  ],
  [
    "animal.lion",
    {}
  ],
  [
    "animal.rabbit",
    {}
  ],
  [
    "animal.snake",
    {}
  ],
  [
    "animal.type",
    {}
  ],
  [
    "commerce.color",
    {}
  ],
  [
    "commerce.department",
    {}
  ],
  [
    "commerce.price",
    {}
  ],
  [
    "commerce.product",
    {}
  ],
  [
    "commerce.productAdjective",
    {}
  ],
  [
    "commerce.productDescription",
    {}
  ],
  [
    "commerce.productMaterial",
    {}
  ],
  [
    "commerce.productName",
    {}
  ],
  [
    "company.bs",
    {}
  ],
  [
    "company.bsAdjective",
    {}
  ],
  [
    "company.bsBuzz",
    {}
  ],
  [
    "company.bsNoun",
    {}
  ],
  [
    "company.catchPhrase",
    {}
  ],
  [
    "company.catchPhraseAdjective",
    {}
  ],
  [
    "company.catchPhraseDescriptor",
    {}
  ],
  [
    "company.catchPhraseNoun",
    {}
  ],
  [
    "company.companyName",
    {}
  ],
  [
    "company.companySuffix",
    {}
  ],
  [
    "company.suffixes",
    {}
  ],
  [
    "database.collation",
    {}
  ],
  [
    "database.column",
    {}
  ],
  [
    "database.engine",
    {}
  ],
  [
    "database.type",
    {}
  ],
  [
    "datatype.array",
    {}
  ],
  [
    "datatype.boolean",
    {}
  ],
  [
    "datatype.datetime",
    {}
  ],
  [
    "datatype.float",
    {}
  ],
  [
    "datatype.hexaDecimal",
    {}
  ],
  [
    "datatype.json",
    {}
  ],
  [
    "datatype.number",
    {}
  ],
  [
    "datatype.string",
    {}
  ],
  [
    "datatype.uuid",
    {}
  ],
  [
    "date.between",
    {}
  ],
  [
    "date.betweens",
    {}
  ],
  [
    "date.future",
    {}
  ],
  [
    "date.month",
    {}
  ],
  [
    "date.past",
    {}
  ],
  [
    "date.recent",
    {}
  ],
  [
    "date.soon",
    {}
  ],
  [
    "date.weekday",
    {}
  ],
  [
    "finance.account",
    {}
  ],
  [
    "finance.accountName",
    {}
  ],
  [
    "finance.amount",
    {}
  ],
  [
    "finance.bic",
    {}
  ],
  [
    "finance.bitcoinAddress",
    {}
  ],
  [
    "finance.creditCardCVV",
    {}
  ],
  [
    "finance.creditCardNumber",
    {}
  ],
  [
    "finance.currencyCode",
    {}
  ],
  [
    "finance.currencyName",
    {}
  ],
  [
    "finance.currencySymbol",
    {}
  ],
  [
    "finance.ethereumAddress",
    {}
  ],
  [
    "finance.iban",
    {}
  ],
  [
    "finance.litecoinAddress",
    {}
  ],
  [
    "finance.mask",
    {}
  ],
  [
    "finance.routingNumber",
    {}
  ],
  [
    "finance.transactionDescription",
    {}
  ],
  [
    "finance.transactionType",
    {}
  ],
  [
    "git.branch",
    {}
  ],
  [
    "git.commitEntry",
    {}
  ],
  [
    "git.commitMessage",
    {}
  ],
  [
    "git.commitSha",
    {}
  ],
  [
    "git.shortSha",
    {}
  ],
  [
    "hacker.abbreviation",
    {}
  ],
  [
    "hacker.adjective",
    {}
  ],
  [
    "hacker.ingverb",
    {}
  ],
  [
    "hacker.noun",
    {}
  ],
  [
    "hacker.phrase",
    {}
  ],
  [
    "hacker.verb",
    {}
  ],
  [
    "helpers.contextualCard",
    {}
  ],
  [
    "helpers.createCard",
    {}
  ],
  [
    "helpers.createTransaction",
    {}
  ],
  [
    "helpers.mustache",
    {}
  ],
  [
    "helpers.randomize",
    {}
  ],
  [
    "helpers.regexpStyleStringParse",
    {}
  ],
  [
    "helpers.repeatString",
    {}
  ],
  [
    "helpers.replaceCreditCardSymbols",
    {}
  ],
  [
    "helpers.replaceSymbolWithNumber",
    {}
  ],
  [
    "helpers.replaceSymbols",
    {}
  ],
  [
    "helpers.shuffle",
    {}
  ],
  [
    "helpers.slugify",
    {}
  ],
  [
    "helpers.userCard",
    {}
  ],
  [
    "image.abstract",
    {}
  ],
  [
    "image.animals",
    {}
  ],
  [
    "image.avatar",
    {}
  ],
  [
    "image.business",
    {}
  ],
  [
    "image.cats",
    {}
  ],
  [
    "image.city",
    {}
  ],
  [
    "image.dataUri",
    {}
  ],
  [
    "image.fashion",
    {}
  ],
  [
    "image.food",
    {}
  ],
  [
    "image.image",
    {}
  ],
  [
    "image.imageUrl",
    {}
  ],
  [
    "image.lorempicsum.avatar",
    {}
  ],
  [
    "image.lorempicsum.image",
    {}
  ],
  [
    "image.lorempicsum.imageBlurred",
    {}
  ],
  [
    "image.lorempicsum.imageGrayscale",
    {}
  ],
  [
    "image.lorempicsum.imageRandomSeeded",
    {}
  ],
  [
    "image.lorempicsum.imageUrl",
    {}
  ],
  [
    "image.lorempixel.abstract",
    {}
  ],
  [
    "image.lorempixel.animals",
    {}
  ],
  [
    "image.lorempixel.avatar",
    {}
  ],
  [
    "image.lorempixel.business",
    {}
  ],
  [
    "image.lorempixel.cats",
    {}
  ],
  [
    "image.lorempixel.city",
    {}
  ],
  [
    "image.lorempixel.fashion",
    {}
  ],
  [
    "image.lorempixel.food",
    {}
  ],
  [
    "image.lorempixel.image",
    {}
  ],
  [
    "image.lorempixel.imageUrl",
    {}
  ],
  [
    "image.lorempixel.nature",
    {}
  ],
  [
    "image.lorempixel.nightlife",
    {}
  ],
  [
    "image.lorempixel.people",
    {}
  ],
  [
    "image.lorempixel.sports",
    {}
  ],
  [
    "image.lorempixel.technics",
    {}
  ],
  [
    "image.lorempixel.transport",
    {}
  ],
  [
    "image.nature",
    {}
  ],
  [
    "image.nightlife",
    {}
  ],
  [
    "image.people",
    {}
  ],
  [
    "image.sports",
    {}
  ],
  [
    "image.technics",
    {}
  ],
  [
    "image.transport",
    {}
  ],
  [
    "image.unsplash.avatar",
    {}
  ],
  [
    "image.unsplash.buildings",
    {}
  ],
  [
    "image.unsplash.food",
    {}
  ],
  [
    "image.unsplash.image",
    {}
  ],
  [
    "image.unsplash.imageUrl",
    {}
  ],
  [
    "image.unsplash.nature",
    {}
  ],
  [
    "image.unsplash.objects",
    {}
  ],
  [
    "image.unsplash.people",
    {}
  ],
  [
    "image.unsplash.technology",
    {}
  ],
  [
    "internet.avatar",
    {}
  ],
  [
    "internet.color",
    {}
  ],
  [
    "internet.domainName",
    {}
  ],
  [
    "internet.domainSuffix",
    {}
  ],
  [
    "internet.domainWord",
    {}
  ],
  [
    "internet.email",
    {}
  ],
  [
    "internet.exampleEmail",
    {}
  ],
  [
    "internet.httpMethod",
    {}
  ],
  [
    "internet.ip",
    {}
  ],
  [
    "internet.ipv6",
    {}
  ],
  [
    "internet.mac",
    {}
  ],
  [
    "internet.password",
    {}
  ],
  [
    "internet.port",
    {}
  ],
  [
    "internet.protocol",
    {}
  ],
  [
    "internet.url",
    {}
  ],
  [
    "internet.userAgent",
    {}
  ],
  [
    "internet.userName",
    {}
  ],
  [
    "lorem.lines",
    {}
  ],
  [
    "lorem.paragraph",
    {}
  ],
  [
    "lorem.paragraphs",
    {}
  ],
  [
    "lorem.sentence",
    {}
  ],
  [
    "lorem.sentences",
    {}
  ],
  [
    "lorem.slug",
    {}
  ],
  [
    "lorem.text",
    {}
  ],
  [
    "lorem.word",
    {}
  ],
  [
    "lorem.words",
    {}
  ],
  [
    "mersenne.rand",
    {}
  ],
  ['mersenne.seed', (fakerFn) => {
    fakerFn.label = 'Seed'
    fakerFn.arguments.push(createArgument('Seed Value', Number));
    return fakerFn;
  }],
  [
    "mersenne.seed_array",
    {}
  ],
  [
    "music.genre",
    {}
  ],
  [
    "name.firstName",
    {}
  ],
  [
    "name.gender",
    {}
  ],
  [
    "name.jobArea",
    {}
  ],
  [
    "name.jobDescriptor",
    {}
  ],
  [
    "name.jobTitle",
    {}
  ],
  [
    "name.jobType",
    {}
  ],
  [
    "name.lastName",
    {}
  ],
  [
    "name.middleName",
    {}
  ],
  [
    "name.prefix",
    {}
  ],
  [
    "name.suffix",
    {}
  ],
  [
    "name.title",
    {}
  ],
  [
    "phone.phoneFormats",
    {}
  ],
  [
    "phone.phoneNumber",
    {}
  ],
  [
    "phone.phoneNumberFormat",
    {}
  ],
  [
    "random.alpha",
    {}
  ],
  [
    "random.alphaNumeric",
    {}
  ],
  [
    "random.arrayElement",
    {}
  ],
  [
    "random.arrayElements",
    {}
  ],
  [
    "random.boolean",
    {}
  ],
  [
    "random.float",
    {}
  ],
  [
    "random.hexaDecimal",
    {}
  ],
  [
    "random.image",
    {}
  ],
  [
    "random.locale",
    {}
  ],
  [
    "random.number",
    {}
  ],
  [
    "random.objectElement",
    {}
  ],
  [
    "random.uuid",
    {}
  ],
  [
    "random.word",
    {}
  ],
  [
    "random.words",
    {}
  ],
  [
    "system.commonFileExt",
    {}
  ],
  [
    "system.commonFileName",
    {}
  ],
  [
    "system.commonFileType",
    {}
  ],
  [
    "system.directoryPath",
    {}
  ],
  [
    "system.fileExt",
    {}
  ],
  [
    "system.fileName",
    {}
  ],
  [
    "system.filePath",
    {}
  ],
  [
    "system.fileType",
    {}
  ],
  [
    "system.mimeType",
    {}
  ],
  [
    "system.semver",
    {}
  ],
  [
    "time.recent",
    {}
  ],
  [
    "vehicle.bicycle",
    {}
  ],
  [
    "vehicle.color",
    {}
  ],
  [
    "vehicle.fuel",
    {}
  ],
  [
    "vehicle.manufacturer",
    {}
  ],
  [
    "vehicle.model",
    {}
  ],
  [
    "vehicle.type",
    {}
  ],
  [
    "vehicle.vehicle",
    {}
  ],
  [
    "vehicle.vin",
    {}
  ],
  [
    "vehicle.vrm",
    {}
  ]
]);
