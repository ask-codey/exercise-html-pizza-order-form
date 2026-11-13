// Checks the order form in index.html: the controls, their names and values, their labels and groups,
// and that the page passes the HTML validator. It doesn't judge how the page looks: the README's checklist does that.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const nodeTest = require('node:test');

// Runs one check. When it fails, the output starts "Not yet:" and says what to fix, with no stack trace to scroll past.
function test(name, run) {
  return nodeTest(name, async (context) => {
    try {
      await run(context);
    } catch (error) {
      const problem = new Error(error.message);
      problem.stack = `Not yet: ${error.message}`;
      throw problem;
    }
  });
}
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM } = require('jsdom');
const { HtmlValidate } = require('html-validate');

const source = readFileSync('index.html', 'utf8');
const page = new JSDOM(source).window.document;
const form = page.querySelector('form');
const all = (selector) => (form ? [...form.querySelectorAll(selector)] : []);
const labelText = (control) => [...control.labels].map((label) => label.textContent.trim()).join(' ');

// Checks a group of radio buttons or checkboxes that share one name.
function checkChoices(type, name, atLeast) {
  const choices = all(`input[type="${type}"][name="${name}"]`);
  assert.ok(choices.length >= atLeast,
    `Add at least ${atLeast} ${type === 'radio' ? 'radio buttons' : 'checkboxes'} with name="${name}" (found ${choices.length}).`);
  const values = choices.map((choice) => choice.getAttribute('value') ?? '');
  for (const choice of choices) {
    const value = choice.getAttribute('value');
    assert.ok(value && value.trim(), `Every ${type} named "${name}" needs a value. Without one, the browser sends ${name}=on.`);
    assert.ok(labelText(choice), `The ${type} with value="${value}" needs its own label, tied to it with for and id.`);
  }
  assert.equal(new Set(values).size, values.length, `Each choice named "${name}" needs a different value (found: ${values.join(', ')}).`);
  return choices;
}

// Checks that every control sits in one fieldset that starts with a legend.
function checkFieldset(controls, what) {
  const fieldsets = new Set(controls.map((control) => control.closest('fieldset')));
  assert.ok(!fieldsets.has(null), `Put every ${what} choice inside a <fieldset>.`);
  assert.equal(fieldsets.size, 1, `Put all the ${what} choices in the same <fieldset>.`);
  const [fieldset] = fieldsets;
  const legend = fieldset.firstElementChild;
  assert.ok(legend && legend.tagName === 'LEGEND' && legend.textContent.trim(),
    `Start the ${what} <fieldset> with a <legend> that asks the question, such as <legend>${what}</legend>.`);
}

test('1) form: sends the order to received.html', () => {
  assert.ok(form, 'Keep the <form> tag that index.html starts with.');
  assert.equal(form.getAttribute('action'), 'received.html', 'The form\'s action should be received.html.');
});

test('2) size: radio buttons named size, each with its own value and label', () => {
  checkChoices('radio', 'size', 3);
});

test('3) size: in a fieldset with a legend', () => {
  checkFieldset(checkChoices('radio', 'size', 3), 'Size');
});

test('4) toppings: checkboxes named topping, each with its own value and label', () => {
  checkChoices('checkbox', 'topping', 4);
});

test('5) toppings: in a fieldset with a legend', () => {
  checkFieldset(checkChoices('checkbox', 'topping', 4), 'Toppings');
});

test('6) crust: a dropdown named crust, every option with a value', () => {
  const crust = form?.querySelector('select[name="crust"]');
  assert.ok(crust, 'Add a <select> with name="crust".');
  const options = [...crust.querySelectorAll('option')];
  assert.ok(options.length >= 3, `Give the crust dropdown an <option> for each crust (found ${options.length}).`);
  for (const option of options) {
    assert.ok(option.getAttribute('value')?.trim(), `The option "${option.textContent.trim()}" needs a value, such as value="thin".`);
  }
  assert.ok(labelText(crust), 'The crust dropdown needs a label, tied to it with for and id.');
});

test('7) delivery or pickup: two radio buttons, in a fieldset with a legend', () => {
  const choices = checkChoices('radio', 'delivery_or_pickup', 2);
  const values = choices.map((choice) => choice.value).sort();
  assert.deepEqual(values, ['delivery', 'pickup'], 'The two choices need the values delivery and pickup.');
  checkFieldset(choices, 'Delivery or pickup');
});

test('8) quantity: a number input from 1 to 10', () => {
  const quantity = form?.querySelector('[name="quantity"]');
  assert.ok(quantity, 'Add an input with name="quantity".');
  assert.equal(quantity.getAttribute('type'), 'number', 'How many pizzas is an amount: give it type="number".');
  assert.equal(quantity.getAttribute('min'), '1', 'Nobody orders zero pizzas: give the quantity min="1".');
  assert.equal(quantity.getAttribute('max'), '10', 'The kitchen takes up to 10 pizzas an order: give the quantity max="10".');
});

test('9) input types: each fits its question', () => {
  const expected = { ready_time: 'time', phone: 'tel', email: 'email' };
  for (const [name, type] of Object.entries(expected)) {
    const input = form?.querySelector(`input[name="${name}"]`);
    assert.ok(input, `Add an input with name="${name}".`);
    assert.equal(input.getAttribute('type'), type, `The input named ${name} should have type="${type}".`);
  }
});

test('10) driver notes: a text area named driver_notes', () => {
  const notes = form?.querySelector('[name="driver_notes"]');
  assert.ok(notes, 'Add a control with name="driver_notes".');
  assert.equal(notes.tagName, 'TEXTAREA', 'Notes for the driver can be a few sentences: use a <textarea>.');
});

test('11) every control: has a name and a label', () => {
  const controls = all('input, select, textarea')
    .filter((control) => !['hidden', 'submit', 'reset', 'button'].includes(control.getAttribute('type')));
  assert.ok(controls.length > 0, 'Add the form\'s controls first.');
  for (const control of controls) {
    const what = control.getAttribute('name') || control.getAttribute('id') || `a <${control.tagName.toLowerCase()}>`;
    assert.ok(control.getAttribute('name')?.trim(), `${what} needs a name, or the browser won't send its answer.`);
    assert.ok(labelText(control), `${what} needs a label the visitor can read.`);
  }
  for (const name of ['customer_name', 'house_number', 'street']) {
    assert.ok(form.querySelector(`[name="${name}"]`), `Add a control with name="${name}" (see menu.txt).`);
  }
});

test('12) button: sends the form', () => {
  const button = form?.querySelector('button:not([type]), button[type="submit"], input[type="submit"]');
  assert.ok(button, 'Add a button that sends the form, such as <button type="submit">Place my order</button>.');
});

test('13) the page: passes the HTML validator', async () => {
  const report = await new HtmlValidate({ extends: ['html-validate:standard'] }).validateString(source);
  const problems = report.results.flatMap((result) =>
    result.messages.map((message) => `line ${message.line}: ${message.message}`));
  assert.ok(report.valid, `The validator found:\n${problems.join('\n')}`);
});
