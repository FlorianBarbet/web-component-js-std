console.log('runner loading...');
/* Store struct session + load and clear dans le control pad */
/* Load function to avoid module first with event */
const _tags = Object.entries(Model)
    .map(([k,v]) => {
        const methods = Service[k] ?? {};
        if(!Service[k]) {
            console.warn(`Service declaration not found for the Model ${k}`)
        }
        if (methods.constructor === Object) {
            methods.constructor = (self) => {
                self.innerHTML = v.reduce((acc, curr)=> `${acc}${curr}`, '');
            }
        }

        return {[k]: Component.parse(k, methods)}
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