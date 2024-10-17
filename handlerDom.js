class X {
    constructor() {
        this.widgets = new Map();
        this.selectedWidget = null;
        this.logsDiv = null
    }

    async init(target, callback) {
        try {
            const widgetElements = Array.from(target.querySelectorAll('[widget]'));
            if (target.getAttribute('widget')) {
                widgetElements.push(target)
            }

            if (!this.logsDiv) {
                this.logsDiv = document.getElementById('logs')
            }

            for (const element of widgetElements) {
                const widgetPath = element.getAttribute('widget');
                if (!this.widgets.has(element)) {
                    const WidgetClass = await this.defaultResolver(widgetPath);
                    const widgetInstance = new WidgetClass();

                    await widgetInstance.init(element, (err, { status }) => {
                        this.addNewLog(`Widget ${widgetPath} has status ${status}.`)
                    });

                    this.widgets.set(element, widgetInstance);


                    element.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.selectWidget(element);
                    });
                }
            }

            callback && callback(null);
        } catch (error) {
            callback && callback(error);
        }
    }

    selectWidget(element) {
        if (this.selectedWidget) {
            this.selectedWidget.classList.remove('selected-widget');
        }

        element.classList.add('selected-widget');
        this.selectedWidget = element;

    }

    destroy(target) {
        const widgetElements = Array.from(target.querySelectorAll('[widget]')).reverse();

        if (target.getAttribute('widget')) {
            widgetElements.push(target)
        }

        for (const element of widgetElements) {
            const widgetInstance = this.widgets.get(element);
            if (widgetInstance) {
                widgetInstance.destroy();
                this.widgets.delete(element);
            }
        }
    }


    doneSelected() {
        if (this.selectedWidget) {
            const widgetInstance = this.widgets.get(this.selectedWidget);
            widgetInstance.doneHandler()

        }
    }

    failSelected() {
        if (this.selectedWidget) {
            const widgetInstance = this.widgets.get(this.selectedWidget);
            widgetInstance.failHandler()

        }
    }

    async defaultResolver(widgetPath) {
        const widgetModule = await import(`./${widgetPath}.js`);
        return widgetModule.default;
    }

    addNewLog(log) {
        const newLog = document.createElement('p')
        newLog.textContent = log
        this.logsDiv.appendChild(newLog)
    }
}


export default X;
