import './style.css';

// Parse data
const alpha2ToNameFile = require('./data/alpha2ToName.json');
const zipsFile = require('./data/zips.json');

// Get only what is needed
let codeToZipRegex = {};
zipsFile.supplementalData.postalCodeData.postCodeRegex.forEach(item => {
    codeToZipRegex[item["_territoryId"]] = `^${item["__text"]}$`;
});

let namesAndCodes = alpha2ToNameFile.countries.country.map(item => {
    return {name: item["_name"], code: item["_alpha-2"]};
});

// Remove unknown codes
const knownCodes = Object.keys(codeToZipRegex);
namesAndCodes = namesAndCodes.filter(item => knownCodes.includes(item.code));

// Get DOM references
const email = document.querySelector("#email");
const country = document.querySelector("#country");
const zip = document.querySelector("#zip");
const pass = document.querySelector("#pass");
const passConfirm = document.querySelector("#pass-confirm");

// Populate select
namesAndCodes.forEach(item => {
    country.appendChild(createOption(item.name, item.code));
});

function createOption(display, value) {
    const option = document.createElement("option");
    option.value = value;
    option.text = display;
    return option;
}

// Validation events
email.onchange = () => {
    const valid = email.checkValidity();
    if (!valid)
    {
        email.parentElement.nextElementSibling.textContent = "Email is invalid!";
    }
    else
    {
        email.parentElement.nextElementSibling.textContent = "";
    }
};

zip.onchange = () => {
    const countryCode = country.value;
    const constraint = new RegExp(codeToZipRegex[countryCode], "");
    const matches = constraint.test(zip.value);

    if (!matches)
    {
        zip.parentElement.nextElementSibling.textContent = "Zip code is invalid!";
    }
    else
    {
        zip.parentElement.nextElementSibling.textContent = "";
    }
};