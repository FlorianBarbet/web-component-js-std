
Service.stats = {
    model: [
        `<div is="${PREFIX_TAG}-input" input-name="{kind} :" input-id="{_id}" input-type="number" input-default="{_value}"></div>`,
        `<div is="${PREFIX_TAG}-input" input-name="Sauv. {kind} :" input-id="s-{_id}"  input-type="text" input-default="{_save_value}"></div>`,
        `<input type="checkbox" id="cb-{_id}" title="Master"/>`
    ],
    attributes:{
        kind: {identifier:'stats-kind', default: 'N/A'},
        _id:  {identifier:'stats-id'},
        _value: {identifier: 'stats-value', default:0},
        _save_value: {identifier: 'stats-value-save', default:0}
    },
    constructor(self) {
        const {kind, _id, _value, _save_value} =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));

        self.innerHTML = this.model
            .reduce((acc, curr) => `${acc}${curr}`, '')
            .format({kind, _id: _id ?? kind.toLowerCase().replaceAll(' ', '-'), _value, _save_value});

        self.firstChild.addEventListener('change',() => {
            const value = self.firstChild.getValue();
            self.setValue(value);
        });
        self.childNodes.item(1).addEventListener('change',() => {
            const value = self.childNodes.item(1).getValue();
            self.setSaveValue(value);
        });
        if (Data[self.getId()]) {
            self.setChecked(Data[self.getId()].checked);
        }
    },
    save() {
        Data[this.getId()] ??= {};
        Data[this.getId()].value = this?.getValue();
        Data[this.getId()].save_value = this?.getSaveValue();
        Data[this.getId()].checked = this?.isChecked();
    },
    load(){
        const savedData = Data[this.getId()];
        if (savedData) {
            this.setValue(savedData.value);
            this.setSaveValue(savedData.save_value);
            this.setChecked(savedData.checked);
        }
    },
    setChecked(checked){
        this.lastChild.checked = checked;
    },
    isChecked(){
        return this.lastChild.checked;
    },
    setValue(value){
        this.attributes._value.default = value;
        this.setAttribute('stats-value', value);
    },
    getValue(){
        return this.getAttribute('stats-value');
    },
    setSaveValue(save_value){
        this.setAttribute('stats-value-save', save_value);
    },
    getSaveValue(){
        return this.getAttribute('stats-value-save');
    },
    getId(){
        return this.getAttribute('stats-id');
    },
};