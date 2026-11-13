# Exercise: A Pizza Order Form

Exercise code for the lesson **Exercise: A Pizza Order Form** in HTML in Depth on [ask-codey.com](https://www.ask-codey.com).

Slice of Heaven Pizza wants to take orders online. You'll build its order form in `index.html`, choosing the right control for every question: radio buttons, checkboxes, a dropdown, typed inputs and a text area. When the form is sent, `received.html` shows exactly what the kitchen would get. Tests check your form as you go.

## What's here

- `index.html`: the order page, with its header, footer and an empty `<form>` tag. For you to finish.
- `menu.txt`: every question the form asks, with the names and values the kitchen's computer expects. Ready to use.
- `received.html`: the page the form sends to. It shows what was sent, as a table. Ready to use.
- `style.css`: the styles for both pages. It styles plain HTML, with no classes, so a well-built form looks good on its own. Ready to use.
- `page.test.js`, `package.json`: the tests and the two tools they use. You don't need to change these.

## What to do

Build the form inside the `<form>` tag in `index.html`, using the names and values in `menu.txt`:

1. **Size:** three radio buttons, grouped in a fieldset with a legend. Medium starts chosen.
2. **Crust:** a dropdown.
3. **Toppings:** a checkbox for each topping, grouped in a fieldset with a legend.
4. **How many pizzas:** a number box that takes 1 to 10.
5. **Delivery or pickup:** two radio buttons, grouped in a fieldset with a legend.
6. **Ready by:** a time between 11:00 and 22:00.
7. **Your details:** your name, phone, email, house number and street, each with the input type that fits it.
8. **Notes for the driver:** a text area, four rows tall.
9. **A button** that sends the form.

Every control gets a label the visitor can read.

## Run it

Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. Fill in the form and send it: `received.html` shows each name and value the form sent.

## Check your work

Open VS Code's terminal (**Terminal > New Terminal**) and run:

```bash
npm install
npm test
```

You only need `npm install` once. At first most tests fail: that's expected. Each part of the form you build turns its test green. A failing test's message says what it looked for, for example *Add at least 3 radio buttons with name="size" (found 0).*

## Checklist for the page

The tests check the HTML. These you check yourself, in the browser:

- [ ] Clicking a label picks its radio button or ticks its checkbox.
- [ ] Only one size and one of delivery or pickup can be chosen at a time.
- [ ] With the keyboard alone (**Tab**, the arrow keys and **Space**), you can fill in the whole form and send it.
- [ ] Sending a Large, thin crust pizza with pepperoni and basil shows `size`, `crust` and two `topping` rows on `received.html`.
- [ ] Typing 11 pizzas, or a time of 23:30, and sending stops with a message from the browser.

## Stretch goal

Make the street box suggest the streets Slice of Heaven delivers to most (they're at the end of `menu.txt`), while still letting a visitor type any street.

## Tips

- Radio buttons that share a `name` are one group. Their `value` is what's sent, and their label is what the visitor reads.
- An unchecked checkbox sends nothing, so `received.html` only lists the toppings that were ticked.
- If adding 1 to an answer makes no sense, it isn't a number box: think about the phone and the house number.
- A `<textarea>` has a closing tag. Keep the two tags next to each other, or the box starts with spaces in it.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Work on GitHub* walks through every screen.
