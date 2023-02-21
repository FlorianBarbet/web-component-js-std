console.log('Service loading...');

const Data = {
    health: {
        value: 100,
        max: 100,
    },
    skills: [
        {item: "skill", kind: "Acrobatie", value: "0", index: 0, checked: false},
        {item: "skill", kind: "Arcanes", value: "0", index: 1, checked: false},
        {item: "skill", kind: "Athlétisme", value: "0", index: 2, checked: false},
        {item: "skill", kind: "Discrétion", value: "0", index: 3, checked: false},
        {item: "skill", kind: "Dressage", value: "0", index: 4, checked: false},
        {item: "skill", kind: "Escamotage", value: "0", index: 5, checked: false},
        {item: "skill", kind: "Histoire", value: "0", index: 6, checked: false},
        {item: "skill", kind: "Intimidation(Cha)", value: "0", index: 7, checked: false},
        {item: "skill", kind: "Investigation(Int)", value: "0", index: 8, checked: false},
        {item: "skill", kind: "Medecine(Sag)", value: "0", index: 9, checked: false},
        {item: "skill", kind: "Nature (Int)", value: "0", index: 10, checked: false},
        {item: "skill", kind: "Perception (Sag)", value: "0", index: 11, checked: false},
        {item: "skill", kind: "Perspicacité (Sag)", value: "0", index: 12, checked: false},
        {item: "skill", kind: "Persuasion (Cha)", value: "0", index: 13, checked: false},
        {item: "skill", kind: "Religion (Int)", value: "0", index: 14, checked: false},
        {item: "skill", kind: "Représentation (Cha)", value: "0", index: 15, checked: false},
        {item: "skill", kind: "Supercherie (Cha)", value: "0", index: 16, checked: false},
        {item: "skill", kind: "Survie (Sag)", value: "0", index: 17, checked: false},
    ]
};

const Service = {};

Service.input = {
    model: [
        '<span title="{_title}"> {fieldName} </span>' ,
        '<input type="{_type}" class="{_class}" id="{_id}" value="{_defaultValue}" disabled="{_disabled}"/>'
    ],
    attributes: {
        fieldName: {identifier: 'input-name', default: 'N/A'},
        _id: {identifier: 'input-id'},
        _class: {identifier: 'input-class', default: ''},
        _type: {identifier: 'input-type', default: 'text'},
        _defaultValue: { identifier: 'input-default', default: '' },
        _title: { identifier: 'span-title'},
        _disabled: {identifier: 'input-disabled', default: false}
    },
    constructor(self) {
        const {fieldName, _id, _class, _type, _defaultValue, _title, _disabled} =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));

        self.innerHTML = this.model
            .reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({_type, _class, _id, fieldName, _defaultValue, _title, _disabled });

        if (!_disabled) {
            self.lastChild.removeAttribute('disabled');
        }

        if (!_title) {
            self.firstChild.removeAttribute('title');
        }
    },
    save() {
        Data[this.getId()] ??= {};
        Data[this.getId()] = this.getValue();
    },
    load() {
        const savedData = Data[this.getId()];
        if (savedData) {
            this.setValue(savedData);
        }
    },
    getId(){
      return this.getAttribute('input-id');
    },
    getValue() {
        return this.lastChild.value;
    },
    setValue(value) {
        this.attributes._defaultValue.default = value;
        this.lastChild.value = value;
    },
};

Service.area = {
    model: [
        `<label for="{_id}" title="{_title}">{fieldName}</label>`,
        `<textarea id="{_id}" name="{_id}" rows="5" cols="33">{_defaultValue}</textarea>`
    ],
    attributes: {
        fieldName: {identifier: 'area-name', default: 'N/A'},
        _title: {identifier: 'label-title'},
        _id: {identifier:'area-id'},
        _defaultValue: { identifier: 'area-default', default: '' },
    },
    constructor(self) {
        const {fieldName, _id, _title, _defaultValue} =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));

        self.innerHTML = this.model
            .reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({_id, fieldName, _title, _defaultValue });

        if (!_title) {
            self.firstChild.removeAttribute('title');
        }
    },
    save() {
        Data[this.getId()] ??= {};
        Data[this.getId()] = this.getValue();
    },
    load() {
        const savedData = Data[this.getId()];
        if (savedData) {
            this.setValue(savedData);
        }
    },
    getId(){
        return this.getAttribute('area-id');
    },
    getValue() {
        return this.lastChild.value;
    },
    setValue(value) {
        this.attributes._defaultValue.default = value;
        this.lastChild.value = value;
    },
};

Service.health = {
    model: [
        `<div is="${PREFIX_TAG}-input" input-name="Vie :" input-id="health" input-type="number"></div>`,
        `<div is="${PREFIX_TAG}-input" input-name="Max :" input-id="max-health" input-type="number"></div>`,
    ],
    constructor(self) {
        self.innerHTML = this.model
            .reduce((acc, curr) => `${acc}${curr}`, '');

        self.lastChild.addEventListener('change', () => {
            const current = self.getMaxHealth();
            if (current < 0) {
                self.setMaxHealth(0);
                return;
            }
            self.setMaxHealth(current);
        });

        self.firstChild.addEventListener('change', () => {
            const current = self.getHealth();
            if (current < 0) {
                self.setHealth(0);
                return;
            }
            self.setHealth(current);
        });
    },
    save() {
       Data.health.max = this.getMaxHealth();
       Data.health.value = this.getHealth();
    },
    load() {
        this.setHealth(Data.health.value);
        this.setMaxHealth(Data.health.max);
    },
    getHealth(){
      return this.firstChild.getValue();
    },
    setHealth(health){
        this.firstChild.setValue(health);
    },
    getMaxHealth(){
        return this.lastChild.getValue();
    },
    setMaxHealth(max_health) {
        this.lastChild.setValue(max_health);
    }
};

const removableTags = (prefix_id) => ({
    constructor(self) {
        const {_id, kind, _value} =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));

        self.innerHTML = this.model
            .reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({kind, _id: `${prefix_id}-${kind?.toLowerCase().replaceAll(' ', '-')}`, _value});

        self.firstChild.firstChild.addEventListener('click', (evt) => {
            if (evt.ctrlKey) {
                self.remove();
                const [generationId,index] = _id.split('-');
                generatedData[generationId].splice(index, 1);
            }
        });
        self.setAttribute('id', `${prefix_id}-${_id}`);
        self.listen?.(self);
    },
    setValue(value){
        this.attributes._value.default = value;
        this.setAttribute( `${prefix_id}-value`, value);
    },
    getValue(){
        return this.getAttribute(`${prefix_id}-value`);
    },
});

Service.skill = {
    model: [
        `<div is="${PREFIX_TAG}-input" input-name="{kind} :" input-id="{_id}" input-type="number" input-default="{_value}" span-title="Press 'Ctrl' then click on me to remove line !"></div>`,
        `<input type="checkbox" id="cb-skill-{_id}" title="Master"/>`
    ],
    attributes: {
        _id: {identifier: 'skill-id'},
        _value: {identifier: 'skill-value', default:0},
        _checked: {identifier: 'skill-checked'},
        kind: {identifier: 'skill-kind'},
    },
    ...removableTags('skill'),
    listen(self) {
        self.firstChild.addEventListener('change', () => {
           const value = self.firstChild.getValue();
           self.setValue(value);
        });
        self.lastChild.addEventListener('change', () => {
            const value = self.lastChild.checked;
            self.setChecked(value);
        });
        self.setChecked(self.getAttribute('skill-checked') ?? false);
    },
    setChecked(checked){
        this.lastChild.checked = Boolean(`${checked ?? false}` === "true");
    },
    isChecked() {
        return this.lastChild.checked;
    }
};

Service.effect = {
    model: [
        `<div is="${PREFIX_TAG}-area" area-name="{kind}" area-id="effect-area-{kind}" area-default="{_value}" label-title="Press 'Ctrl' then click on me to remove line !"></div>`
    ],
    attributes: {
        _id: {identifier: 'effect-id'},
        _value: {identifier: 'effect-value', default:''},
        kind: {identifier: 'effect-kind'},
    },
    ...removableTags('effect'),
    listen(self) {
        self.addEventListener('change', () => {
            const value = self.firstChild.getValue();
            self.setValue(value);
        });
    }
};

const generatedData = {};
Service.generator = {
    // you should provide what should be generated (one line item only)
    items(key, kind, _id, value = null, checked = false) {
        return ({
            skill: `<div is="${PREFIX_TAG}-skill" skill-kind="${kind}" skill-value="${value ?? 0}" skill-id="${_id}" skill-checked="${checked}"></div>`,
            effect: `<div is="${PREFIX_TAG}-effect" effect-kind="${kind}" effect-value="${value ?? ''}" effect-id="${_id}"></div>`,
        })[key];
    },
    model: [
        `<input type="text" id="{item}-generator" placeholder="Crachat de sang (II)..."/>`,
        `<button>Ajouter</button>`,
        `<div class="area-generation-{item}"></div>`
    ],
    attributes: {
        _id: {identifier:'generator-id'},
        item: {identifier: 'generator-item'},
    },
    constructor(self) {
        const {_id, item} =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));
        self.setAttribute('class', `${item}-generator`);
        self.innerHTML = this.model
            .reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({item});

        self.querySelector("button").addEventListener('click', (e) => {
            e.stopPropagation();
            const content = self.firstChild.value;
            if (content.trim() !== "") {
                const area = generatedData[self.getId()] ??= [];
                self.generateSkill(item, self.lastChild, self.firstChild.value, area.length);
            }
        });
        self.setAttribute('id', _id);
    },
    getId(){
      return this.getAttribute('generator-id');
    },
    generateSkill(item, generation_zone, kind, index, value= null, checked= null) {
        const div = document.createElement('div');
        generation_zone.appendChild(div);
        div.outerHTML = this.items(item, kind, `${this.getId()}-${index}`, value, checked ?? false);
        generatedData[this.getId()] ??= [];
        generatedData[this.getId()].push({item, kind, value, index});
    },
    save() {
        // unreference by destructuring
        Data[this.getId()] = [...this.getGeneratedValues()];
    },
    load(){
        if (Data[this.getId()]) {
            for (const data of Data[this.getId()]) {
                this.generateSkill(data.item, this.lastChild, data.kind, data.index, data.value, data.checked)
            }
        }
    },
    getGeneratedValues(){
        const values = [];
        for (const [index, node] of this.lastChild.childNodes.entries()) {
            const value = node.getValue();
            const checked = node.isChecked?.() ?? false;
            const infos = generatedData[this.getId()]?.[index];
            values.push({...infos, value, index, checked});
        }
        return values;
    }
};

const save_and_load = {
    load() {
        for (const [index, node] of this.childNodes.entries()) {
            if ( index >= 1) {
                node.load()
            }
        }
    },
    save() {
        for (const [index, node] of this.childNodes.entries()) {
            if ( index >= 1) {
                node.save();
            }
        }
    }
};

Service.characteristics = {
    ...save_and_load
};

Service.character = {
    ...save_and_load
};

Service.skills = {
    ...save_and_load
}

Service.spells = {
    ...save_and_load
};

Service.class_spell = {
    ...save_and_load
};

Service.stuff = {
    ...save_and_load
};

Service.bag = {
    ...save_and_load
};