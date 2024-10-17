class Widget {
    constructor() {
        this.target = null
        this.isInitialized = false;
        this.status = null
        this.cb = null
        this.statusDiv = null
    }



    async init(target, done) {
        if (this.isInitialized) {
            throw new Error("Widget is already initialized.");
        }
        target.classList.add('widget');


        this.isInitialized = true;

        this.target = target
        target.widgetInstance = this;
        this.cb = done
        this.changeStatus('init')
    }

    destroy() {
        if (!this.isInitialized) {
            throw new Error("Widget is not initialized.");
        }
        const childWidgets = this.target.querySelectorAll('[widget]');

        Array.from(childWidgets).reverse().forEach(childElement => {
            const widgetInstance = childElement.widgetInstance;
            console.log('instance', childElement.widgetInstance)
            if (widgetInstance && typeof widgetInstance.destroy === 'function') {
                widgetInstance.destroy();
            }
        });
        this.target.classList.remove('widget-init', 'widget-done', 'widget-fail');
        this.isInitialized = false;
        this.target.widgetInstance = null
        this.changeStatus('destroy')
        this.statusDiv.innerHTML = ''
    }

    changeStatus(status) {

        if (!this.statusDiv) {
            this.statusDiv = document.createElement('div');
            this.target.appendChild(this.statusDiv);
        }

        const widgetPath = this.target.getAttribute('widget');

        this.target.classList.remove('widget-init', 'widget-done', 'widget-fail');

        this.status = status;
        this.cb(null, { status: this.status });

        this.target.classList.add(`widget-${status}`);

        this.statusDiv.innerHTML = `${widgetPath} status: ${this.status}`;
    }


    doneHandler() {
        this.changeStatus('done')
    }
    failHandler() {
        this.changeStatus('fail')
    }
}

export default Widget;