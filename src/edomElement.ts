class edomElement {
    public element: HTMLElement;
    public children: edomElement[] = [];

    private _text: string = "";
    public get text(): string {
        return this._text;
    }

    public set text(text: string) {
        this._text = text;
        this.element.innerText = this._text;
    }

    public parent: edomElement | undefined = undefined;
    public classes: string[] = [];
    public tag: string;

    private _id: string;
    public get id(): string {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
        this.element.id = id;
    }

    private handlers: handlerObject = {};

    private values: eObj = {};

    constructor(
        fromExisting: boolean,
        tagname: string,
        existingElement: HTMLElement | null = null
    ) {
        this._id = Math.random().toString() + Math.random().toString();
        if (fromExisting === true) {
            if (existingElement === null) {
                throw new edomElementNullException("Given Element is null");
            } else {
                this.element = existingElement!;
            }
        } else {
            this.element = document.createElement(tagname);
        }
        edom.allElements.push(this);
        this.tag = tagname;
        return this;
    }

    public addChild(child: edomElement) {
        this.children.push(child);
        this.element.appendChild(child.element);
        child.parent = this;
    }

    public setProperty(key: string, value: any) {
        this.values[key] = value;
    }

    public getProperty(key: string): any {
        return this.values[key];
    }

    public addClick(identifier: string, func: (self: this) => any) {
        this.addEvent("click", identifier, func);
    }

    public doClick() {
        this.element.click();
    }

    public deleteClick(identifier: string) {
        this.deleteEvent("click", identifier);
    }

    public addEvent(
        type: string,
        identifier: string,
        action: (self: this) => any
    ) {
        const hdlr: () => void = () => {
            action(this);
        };
        this.handlers[identifier] = hdlr;

        this.element.addEventListener(type, hdlr);
    }

    public deleteEvent(type: string, identifier: string) {
        this.element.removeEventListener(type, this.handlers[identifier]);
    }

    public applyStyle(...className: string[]) {
        className.forEach((_class: string) => {
            this.element.classList.add(_class);
            this.classes.push(_class);
        });
    }

    public removeStyle(...className: string[]) {
        className.forEach((_class: string) => {
            this.element.classList.remove(_class);

            const index: number = this.classes.indexOf(_class);
            if (index > -1) {
                this.classes.splice(index, 1);
            }
        });
    }

    public hasStyle(...className: string[]): boolean {
        let hasStyle: boolean = true;

        className.forEach((_class: string) => {
            if (!this.classes.includes(_class)) {
                hasStyle = false;
            }
        });
        return hasStyle;
    }

    public swapStyle(oldClass: string, newClass: string) {
        this.removeStyle(oldClass);
        this.applyStyle(newClass);
    }

    public delete(isChild: boolean = false): boolean {
        if (isChild === false) {
            if (this.parent !== undefined) {
                for (let i = 0; i < this.parent!.children.length; i++) {
                    if (this.parent!.children[i].id === this.id) {
                        this.parent!.children.splice(i, 1);
                    }
                }
            }
        }

        for (let i = 0; i < edom.allElements.length; i++) {
            if (edom.allElements[i].id === this.id) {
                edom.allElements.splice(i, 1);
            }
        }

        this.children.forEach((child: edomElement) => {
            child.delete(true);
        });
        this.element.remove();
        for (let key in this) delete this[key];
        return true;
    }
    // TODO programmatischer machen -> nicht über Klasse in css, sondern z.B Eigenschaft von element?
    public enable() {
        this.swapStyle("hidden", "visible");
    }
    // TODO programmatischer machen -> nicht über Klasse in css, sondern z.B Eigenschaft von element?
    public disable() {
        this.swapStyle("visible", "hidden");
    }

    public focus() {
        this.element.focus();
    }
}
