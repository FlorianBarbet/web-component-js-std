const PREFIX_TAG = undefined ?? 'custom'; // customize your prefix, default: custom

const create_script = (src) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.setAttribute('src', src);
    return script;
};

const structure_container = document.createElement('div');
document.body.appendChild(structure_container);

const app_container = document.createElement('div');
app_container.setAttribute('class', 'container');
document.body.appendChild(app_container);

const module_container = document.createElement('div');
structure_container.appendChild(module_container);

const plugin_container = document.createElement('div');
structure_container.appendChild(plugin_container);

const runner_container = document.createElement('div');
structure_container.appendChild(runner_container);

const plugins = [
    "log.js"
];

const modules = [
    "module/common.js",
    "module/Component.js",
    "module/Model.js",
    "module/Service.js"
];

(function () {

    for (const module of modules) {
        module_container.appendChild(create_script(module));
    }

    for (const plugin of plugins) {
        plugin_container.appendChild(create_script(plugin));
    }

    return new Promise((resolve) => setTimeout(resolve, 100)); // hack to load module before runner...
})().then(() => {
    runner_container.appendChild(create_script("runner.js"))
});

function Application (){ /* static prototype but can be extended */ }
Application.run = function () {
    const card_loader = Tags['card_loader'].cloneNode();
    app_container.appendChild(card_loader);

    const search_bar = Tags['search_bar'].cloneNode();
    app_container.appendChild(search_bar);

    const catalogue = Tags['catalogue'].cloneNode();
    app_container.appendChild(catalogue);

    // theses should be available when the app is completly build !
    Application.load = function (nodes){
        Object.values(nodes).forEach(node => node?.load?.());
    }

    Application.save = function () {
    }

    document.addEventListener('keydown', (evt) => {
        if (evt.ctrlKey && evt.key === 's'){
            let el = document.querySelector( ':focus' );
            if ( el ) el.blur(); //leave focus cause textarea hit changes on leaving focus !
            evt.preventDefault();
            Application.save();
        }

        if (evt.ctrlKey && evt.key === 'l'){
            evt.preventDefault();
            Application.load({ catalogue });
        }

    });

    return {
        catalogue
    }
}

