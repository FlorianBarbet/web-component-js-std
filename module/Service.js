console.log('Service loading...');

const Service = {};

Service.card_header = {
    model: [
        `<h3> {title} </h3>`,
        `<div>{spell_type} niv. {spell_level}</div>`,
        `<ul>`,
            `<li><bold>Incantation:</bold> {cast_time}</li>`,
            `<li><bold>Portee:</bold> {spell_range}</li>`,
            `<li><bold>Composantes:</bold> {spell_composition}</li>`,
            `<li><bold>Duree:</bold> {spell_duration}</li>`,
        `</ul>`
    ],
    attributes: {
        title: { identifier: 'card-title', default: 'N/A' },
        spell_type: { identifier: 'spell-type', default: 'N/A' },
        spell_level: { identifier: 'spell-level', default: 'N/A' },
        cast_time: { identifier: 'cast-time', default: 'N/A' },
        spell_range: { identifier: 'spell-range', default: 'N/A' },
        spell_composition: { identifier: 'spell-composition', default: 'N/A' },
        spell_duration: { identifier: 'spell-duration', default: 'N/A' }
    },
    constructor(self) {
        const {
            title,
            spell_type, spell_level,
            cast_time, spell_range,
            spell_composition, spell_duration
        } =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({
                title: ` - ${title}`,
                spell_type, spell_level,
                cast_time, spell_range,
                spell_composition, spell_duration
            });
    }

};

Service.card_body = {
    model: [
        `<details>`,
            `<summary><bold>Description :</bold></summary>`,
            `{spell_description}`,
        `</details>`
    ],
    attributes: {
        spell_description: { identifier: 'spell-description', default: 'N/A' }
    },
    constructor(self) {
        const { spell_description } =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({ spell_description });
    }
};

Service.card = {
    model: [
        `<div class="card">`,
            `<div is="${PREFIX_TAG}-card_header" card-title="{title}" spell-type="{spell_type}" spell-level="{spell_level}" cast-time="{cast_time}" spell-range="{spell_range}" spell-composition="{spell_composition}" spell-duration="{spell_duration}"></div>`,
            `<hr/>`,
            `<div is="${PREFIX_TAG}-card_body" spell-description="{spell_description}"></div>`,
            `<hr/>`,
        `</div>`
    ],
    attributes: {
        title: { identifier: 'card-title', default: 'N/A' },
        spell_type: { identifier: 'spell-type', default: 'N/A' },
        spell_level: { identifier: 'spell-level', default: 'N/A' },
        cast_time: { identifier: 'cast-time', default: 'N/A' },
        spell_range: { identifier: 'spell-range', default: 'N/A' },
        spell_composition: { identifier: 'spell-composition', default: 'N/A' },
        spell_duration: { identifier: 'spell-duration', default: 'N/A' },
        spell_description: { identifier: 'spell-description', default: 'N/A' }
    },
    focus: false,
    constructor(self) {
        const {
            title,
            spell_type, spell_level,
            cast_time, spell_range,
            spell_composition, spell_duration,
            spell_description
        } =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier) ?? v.default};
            }));
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({
                title,
                spell_type, spell_level,
                cast_time, spell_range,
                spell_composition, spell_duration,
                spell_description
            });
        self.addEventListener('dblclick', () => {
            const card_nodes = document.querySelectorAll(`div[is=${PREFIX_TAG}-card]`);
            for (const node of card_nodes) {
                if (self.focus === true) {
                    node.show?.();
                    continue;
                }

                const node_title = node.getAttribute(self.attributes.title.identifier);
                if (node_title !== title) {
                    node.hide?.();
                }
            }
            self.focus = !self.focus;
        });
    },
    hide() {
        this.style.display = 'none';
    },
    show() {
        this.style.display = 'block';
    }
};

Service.catalogue = {
    model: [
        `<h1> Sorts </h1>`,
        `<div class="collectible"> {content} </div>`
    ],
    template: `<div class="card-container" is="${PREFIX_TAG}-card" spell-description="{spell_description}" card-title="{title}" spell-type="{spell_type}" spell-level="{spell_level}" cast-time="{cast_time}" spell-range="{spell_range}" spell-composition="{spell_composition}" spell-duration="{spell_duration}"></div>`,
    attributes: {
        title: { identifier: 'search-title' },
        level: { identifier: 'search-level' }
    },
    constructor(self) {
        const store = sessionStorage.getItem("spells");
        if (!store) {
            return;
        }
        const content = JSON.parse(store).spells.map((card_data) => {
            return this.template.format({
                title: card_data.title,
                spell_type: card_data.spell.type,
                spell_level: card_data.spell.level,
                cast_time: card_data.spell.cast,
                spell_range: card_data.spell.range,
                spell_composition: card_data.spell.composition,
                spell_duration: card_data.spell.duration,
                spell_description: card_data.spell.description
            });
        })?.reduce((acc, curr)=> `${acc}${curr}`, '');
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({ content });

        const { title, level } =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: self.getAttribute(v.identifier)};
            }));
        this.search({ title, level });
    },
    load() {
        const store = sessionStorage.getItem("spells");
        if (!store) {
            return;
        }
        const grimoire = JSON.parse(store).spells;
        grimoire.sort((a, b) => a.spell.level - b.spell.level || (() => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0
        })());
        const content = grimoire
            .map((card_data) => {
                return structuredClone(this.template).format({
                    title: card_data.title,
                    spell_type: card_data.spell.type,
                    spell_level: card_data.spell.level,
                    cast_time: card_data.spell.cast,
                    spell_range: card_data.spell.range,
                    spell_composition: card_data.spell.composition,
                    spell_duration: card_data.spell.duration,
                    spell_description: card_data.spell.description
            });
        })?.reduce((acc, curr)=> `${acc}${curr}`, '');

        this.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '')
            .format({ content });
        const { title, level } =
            Object.assign(...Object.entries(this.attributes).map(([k,v]) => {
                return {[k]: this.getAttribute(v.identifier)};
            }));
        this.search({ title, level });
    },
    search({level, title}) {
        for (const [index, node] of (this.lastChild?.childNodes.entries() ?? [])) {
            if (index >= 1 && index < this.lastChild.childNodes.length-1 && node?.show && node?.hide) {
                const node_title = node.getAttribute(node.attributes.title.identifier);
                const node_level = node.getAttribute(node.attributes.spell_level.identifier);
                if (level) {
                    if ( +node_level === +level ) {
                        node.show();
                    } else {
                        node.hide();
                        continue;
                    }
                }

                if (title) {
                    if ( node_title.toLowerCase().startsWith(title.toLowerCase()) ) {
                        node.show();
                    } else {
                        node.hide();
                        continue;
                    }
                }

                if (!title && !level) {
                    node.show();
                }
            }
        }
    }
};

Service.search_bar = {
    model: [
        '<span title="Search"> Rechercher </span>' ,
        '<input type="text" id="search_bar_input"/>'
    ],
    constructor(self) {
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '');

        self.lastChild.addEventListener("input", (event) => {
            const value = self.lastChild.value;
            if (value.includes(";") || value.includes(":") || value.includes("title")) {
                const [first_predicate, second_predicate] = value.split(";").map((p) => p.split(":"));
                const search_predicate = { [first_predicate[0]]: first_predicate[1] };
                if (second_predicate) {
                    search_predicate[second_predicate[0]] = second_predicate[1];
                }
                if (search_predicate.title) {
                    nodes.catalogue.setAttribute("search-title", search_predicate.title);
                } else {
                    nodes.catalogue.removeAttribute("search-title");
                }

                if (search_predicate.level) {
                    nodes.catalogue.setAttribute("search-level", search_predicate.level);
                } else {
                    nodes.catalogue.removeAttribute("search-level");
                }
            } else {
                if (isNaN(+value)) {
                    nodes.catalogue.setAttribute("search-title", value);
                    nodes.catalogue.removeAttribute("search-level");
                } else {
                    nodes.catalogue.removeAttribute("search-title");
                    nodes.catalogue.setAttribute("search-level", value);
                }
            }

        });
    }
}

Service.card_loader = {
    model: [
        '<span title="card-loader"> Charger un grimoire </span>' ,
        '<input type="file" id="card_loader_input"/>'
    ],
    constructor(self) {
        if (!!sessionStorage.getItem("spells")){
            self.innerHTML = '<input type="button" value="Changer de grimoire" onclick="Service.card_loader.clear()" />';
            return;
        }
        self.innerHTML = this.model?.reduce((acc, curr)=> `${acc}${curr}`, '');

        self.lastChild.addEventListener("input", (event) => {
            const input = document.getElementById('card_loader_input');
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function() {
                const contents = reader.result;
                sessionStorage.setItem("spells", contents.toString());
                Application.load(nodes);
                self.innerHTML = '<input type="button" value="Changer de grimoire" onclick="Service.card_loader.clear()" />';
            };
            reader.readAsText(file);
        });
    },
    clear() {
        sessionStorage.clear();
        location.reload(); // to replace with a SPA reload
    }
}
