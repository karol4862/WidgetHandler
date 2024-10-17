import Widget from "../Widget.js";

class WidgetB extends Widget {
    constructor() {
        super()
        this.content = null
    }
    async init(target, done) {
        super.init(target, done);
        const div = document.createElement('div');
        div.innerHTML = 'WidgetB'
        target.appendChild(div);
        this.content = div
    }

    destroy() {
        this.content.remove()
        super.destroy()
    }
}

export default WidgetB;