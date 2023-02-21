console.log('Model loading...');
const Model = {}

Model.input = []; // model registered in the service

Model.area = []; // model registered in the service

Model.health = []; // model registered in the service

Model.stats = []; // model registered in the service

Model.skill = []; // model registered in the service

Model.effect = []; // model registered in the service

Model.generator = []; // model registered in the service

Model.characteristics =  [
    `<h1>Caracteristiques</h1>`,
    `<div is="${PREFIX_TAG}-health"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Force" stats-id="strength" stats-value="0" stats-value-save="0"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Dexterite" stats-id="dexterity"  stats-value="0" stats-value-save="0"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Constitution" stats-id="constitution"  stats-value="0" stats-value-save="0"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Intelligence" stats-id="intelligence"  stats-value="0" stats-value-save="0"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Sagesse" stats-id="wisdom"  stats-value="0" stats-value-save="0"></div>`,
    `<div is="${PREFIX_TAG}-stats" stats-kind="Charisme" stats-id="charisma"  stats-value="0" stats-value-save="0"></div>`,
];

Model.character = [
    `<h1>Fiche de personnage</h1>`,
    `<div is="${PREFIX_TAG}-input" input-name="Nom :" input-id="name"></div>`,
    `<div is="${PREFIX_TAG}-input" input-name="Prenom :" input-id="firstname"></div>`,
    `<div is="${PREFIX_TAG}-input" input-name="Age :" input-id="age" input-type="number" input-default="1"></div>`,
    `<div is="${PREFIX_TAG}-input" input-name="Classe :" input-id="class"></div>`,
    `<div is="${PREFIX_TAG}-input" input-name="Niveau :" input-id="level" input-type="number" input-default="1"></div>`,
];

Model.skills = [
    `<h1> Competences </h1>`,
    `<div is="${PREFIX_TAG}-generator" generator-item="skill" generator-id="skills"></div>`
];

Model.spells = [
    `<h1> Sorts </h1>`,
    `<div is="${PREFIX_TAG}-generator" generator-item="effect" generator-id="spells"></div>`
];

Model.class_spell = [
    `<h1> Sorts de classe</h1>`,
    `<div is="${PREFIX_TAG}-generator" generator-item="effect" generator-id="class_spell"></div>`
];

Model.stuff = [
    `<h1> Equipement </h1>`,
    `<div is="${PREFIX_TAG}-generator" generator-item="effect" generator-id="stuff"></div>`
];

Model.bag = [
    `<h1> Inventaire </h1>`,
    `<div is="${PREFIX_TAG}-input" input-name="PO :" input-id="money" input-type="number" input-default="0" input-id="bag"></div>`,
    `<div is="${PREFIX_TAG}-generator" generator-item="effect" generator-id="bag"></div>`,
];