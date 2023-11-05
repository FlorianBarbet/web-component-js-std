console.log('Component loading...');
function Component(){ /* static prototype */ }
Component.observeAttributes = (element, target) => {
    if(target.length === 0) return;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && target.includes(mutation.attributeName)) {
                element.save?.();
                element.constructor(element);
            }
        });
    });

    observer.observe(element, {attributes: true});
}

Component.parse = ( partialTagName, _methods = {} ) => {
    const tagName = `${PREFIX_TAG}-${partialTagName}`
    const AnonymousClass = class extends HTMLDivElement {
        attributes = [];
        properties = [];
        model = [];

        content;
        constructor() {
            const self = super();
            _methods.constructor?.(self);

            this.content = self.innerHTML; // IDE doesn't detect that is used
            self.setAttribute(tagName, "");

            if (!self.getAttribute('class')) self.setAttribute('class', partialTagName);
            if (_methods.attributes) {
                this.properties = Object.assign(...Object.entries(_methods.attributes).map(([k,v]) => {
                    return {[k]: self.getAttribute(v.identifier) ?? v.default};
                })); // IDE doesn't detect that is used
                this.attributes = _methods.attributes;
            }
            if (_methods.model) this.model = _methods.model;
            Component.observeAttributes(self, this.observe());
        }

        observe() {
            return Object.values(this.attributes)
                .map(v => v.identifier);
        }
    };
    Object.entries(_methods)
        .forEach(([methodName, _method]) => AnonymousClass["prototype"][methodName] = _method);
    Object.defineProperty(AnonymousClass, 'name', {value: tagName});
    customElements.define(tagName, AnonymousClass, {extends: 'div'});
    return document.createElement('div', {is: tagName});
};
