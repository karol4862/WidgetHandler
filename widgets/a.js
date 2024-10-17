import Widget from "../Widget.js";

class WidgetA extends Widget {
    constructor() {
        super()
        this.isOpen = false
        this.content = null
    }
    async init(target, done) {
        await super.init(target, done);

        const div = document.createElement('div');
        div.innerHTML = 'Widget A';
        target.appendChild(div);
        this.content = div

        // const data = 'data';
        // target.innerHTML = `<div>Data: ${data}</div>`;
    }



    destroy() {
        this.content.remove()
        super.destroy()
    }
}

export default WidgetA;