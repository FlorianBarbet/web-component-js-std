console.log('runner loading...');

/* Store struct session + load and clear dans le control pad */
/* Load function to avoid module first with event */
const _tags = Object.entries(Model)
    .map(([modelName, model]) => {
        const instance = Service[modelName] ?? {};
        if(!Service[modelName]) {
            console.warn(`Service declaration not found for the Model ${modelName}`)
        }
        if (instance.constructor === Object) {
            instance.constructor = (self) => {
                self.innerHTML = model.reduce((acc, curr)=> `${acc}${curr}`, '');
            }
        }

        return {[modelName]: Component.parse(modelName, instance)}
    });

/**
 * Example of generation by code
 *
 * const strength = Tags['stats'].cloneNode();
 * strength.setAttribute('stats-kind', 'Force');
 * strength.setAttribute('stats-id', 'strength'); // custom id
 * app_container.appendChild(strength);
 *
 * const defense = Tags['stats'].cloneNode();
 * defense.setAttribute('stats-kind', 'Dexterite');
 * app_container.appendChild(defense);
*/
const Tags = Object.assign(..._tags);
const nodes = Application.run();
Application.load(nodes);