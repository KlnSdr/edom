// interfaces =======================================================================================
interface handlerObject {
    [id: string]: () => void;
}

interface eObj {
    [key: string]: any;
}

interface handlerPreObject extends Object {
    id: string;
    type: string;
    body: (self: edomElement) => void;
}

interface edomTemplate extends Object {
    tag: string;
    text?: string;
    id?: string;
    classes?: string[];
    children?: edomTemplate[];
    type?: string;
    checked?: boolean;
    src?: string;
    for?: string;
    groupID?: string;
    target?: string;
    handler?: handlerPreObject[];
}
// edomError ========================================================================================
class edomElementNullExeption {
    message: string;
    constructor(message: string) {
        this.message = message;
        console.error(message);
    }
}

// edom =============================================================================================
class edom {
    public static body: edomElement;

    private static _allElements: edomElement[];
    public static get allElements(): edomElement[] {
        return edom._allElements;
    }

    public static init() {
        edom._allElements = [];

        edom.body = edom.fromExisting(document.body);
        edom.body.id = 'body';
    }

    public static newElement(
        tagname: string
    ):
        | edomElement
        | edomInputElement
        | edomAnchorElement
        | edomListElement
        | edomImageElement
        | edomLabelElement
        | edomTAElement {
        switch (tagname.toLowerCase()) {
            case 'input':
                const elmnt: edomInputElement = new edomInputElement(
                    false,
                    tagname
                ) as edomInputElement;
                elmnt.addChange('onInput', (self: edomInputElement) => {
                    self.value = (self.element as HTMLInputElement).value;
                });
                return elmnt;

            case 'textarea':
                const ta: edomTAElement = new edomInputElement(
                    false,
                    tagname
                ) as edomTAElement;
                ta.addChange('onInput', (self: edomTAElement) => {
                    self.value = (self.element as HTMLTextAreaElement).value;
                });
                return ta;
            case 'a':
                return new edomAnchorElement(false, tagname);
            case 'ul':
            case 'ol':
                return new edomListElement(false, tagname);
            case 'img':
                return new edomImageElement(false, tagname);
            case 'label':
                return new edomLabelElement(false, tagname);
            default:
                return new edomElement(false, tagname);
        }
    }

    public static fromExisting(element: HTMLElement) {
        edom.iterateChildren(element);
        return new edomElement(true, '', element);
    }

    private static iterateChildren(element: HTMLElement) {
        edom.getChildren(element).forEach((child: Element) => {
            console.log(child);
        });
    }

    private static getChildren(element: HTMLElement): Array<Element> {
        return Array.from(element.children);
    }

    public static findById(
        id: string
    ):
        | edomElement
        | edomInputElement
        | edomAnchorElement
        | edomListElement
        | edomImageElement
        | edomLabelElement
        | edomTAElement
        | undefined {
        let toReturn: edomElement | undefined = undefined;
        edom.allElements.forEach((element: edomElement) => {
            if (element.id === id) {
                toReturn = element;
            }
        });

        return toReturn;
    }

    public static break() {
        return edom.newElement('br');
    }

    public static fromTemplate(
        template: edomTemplate | edomTemplate[],
        parent: edomElement | null = null
    ) {
        if (parent === null) {
            if ((template as edomTemplate).classes != undefined) {
                edom.body.applyStyle(
                    ...((template as edomTemplate).classes || [])
                );
            }
            this.fromTemplate(
                (template as edomTemplate).children as edomTemplate[],
                edom.body
            );
        } else {
            for (let i = 0; i < (template as edomTemplate[]).length; i++) {
                const _template: edomTemplate = (template as edomTemplate[])[
                    i
                ] as edomTemplate;
                const currentChild: edomElement = edom.newElement(
                    _template.tag
                );
                if (_template.id != undefined) {
                    currentChild.id = _template.id;
                }
                if (_template.text != undefined) {
                    currentChild.text = _template.text;
                }
                if (_template.type != undefined) {
                    (currentChild as edomInputElement).type = _template.type;
                }
                if (_template.checked != undefined) {
                    (currentChild as edomInputElement).checked =
                        _template.checked;
                    currentChild.addClick(
                        'clickChangeState',
                        (self: edomElement) => {
                            if (
                                (self as edomInputElement).checked ===
                                (self.element as HTMLInputElement).checked
                            ) {
                                return;
                            }
                            (self as edomInputElement).checked = (
                                self.element as HTMLInputElement
                            ).checked;
                        }
                    );
                }
                if (_template.classes != undefined) {
                    currentChild.applyStyle(..._template.classes);
                }
                if (_template.src != undefined) {
                    (currentChild as edomImageElement).src = _template.src;
                }
                if (_template.for != undefined) {
                    (currentChild as edomLabelElement).for = _template.for;
                }
                if (_template.groupID != undefined) {
                    (currentChild as edomInputElement).groupID =
                        _template.groupID;
                }
                if (_template.target != undefined) {
                    (currentChild as edomAnchorElement).href(_template.target);
                }
                if (_template.handler != undefined) {
                    _template.handler.forEach((handler: handlerPreObject) => {
                        currentChild.addEvent(
                            handler.type,
                            handler.id,
                            (self: edomElement) => {
                                handler.body(self);
                            }
                        );
                    });
                }
                parent.addChild(currentChild);

                if (_template.children != undefined) {
                    this.fromTemplate(_template.children, currentChild);
                }
            }
        }
    }
}
// edomElement ======================================================================================
class edomElement {
    public element: HTMLElement;
    public children: edomElement[] = [];

    private _text: string = '';
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
                throw new edomElementNullExeption('Given Element is null');
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
        this.addEvent('click', identifier, func);
    }

    public doClick() {
        this.element.click();
    }

    public deleteClick(identifier: string) {
        this.deleteEvent('click', identifier);
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
        this.swapStyle('hidden', 'visible');
    }
    // TODO programmatischer machen -> nicht über Klasse in css, sondern z.B Eigenschaft von element?
    public disable() {
        this.swapStyle('visible', 'hidden');
    }

    public focus() {
        this.element.focus();
    }
}
// edomInputElement =================================================================================
class edomInputElement extends edomElement {
    private _value: string = '';
    public get value(): string {
        return this._value;
    }

    public set value(val: string) {
        this._value = val;
        (this.element as HTMLInputElement).value = val;
    }

    private _type: string = 'text';
    public get type(): string {
        return this._type;
    }
    public set type(type: string) {
        this._type = type;
        (this.element as HTMLInputElement).type = type;
    }

    private _checked: boolean = false;
    public get checked(): boolean {
        return this._checked;
    }
    public set checked(state: boolean) {
        this._checked = state;
        (this.element as HTMLInputElement).checked = state;
    }

    private _groupID: string = '';
    public get groupID(): string {
        return this._groupID;
    }
    public set groupID(id: string) {
        this._groupID = id;
        (this.element as HTMLInputElement).name = this._groupID;
    }

    public addChange(identifier: string, func: (self: this) => any) {
        this.addEvent('input', identifier, (self) => {
            func(self);
        });
    }

    public deleteChange(identifier: string) {
        this.deleteEvent('input', identifier);
    }

    public select() {
        (this.element as HTMLInputElement).select();
    }
}

class edomTAElement extends edomInputElement {
    public setContent(text: string) {
        (this.element as HTMLTextAreaElement).value = text;
        this.value = text;
    }
}
// edomAnchorElement ================================================================================
class edomAnchorElement extends edomElement {
    public target: string = '';

    public href(location: string) {
        this.target = location;
        (this.element as HTMLAnchorElement).href = this.target;
    }
}
// edomListElement ==================================================================================
class edomListElement extends edomElement {
    public addEntry(text: string) {
        const anstrich: edomElement = edom.newElement('li');
        anstrich.text = text;

        this.addChild(anstrich);
    }

    public addEntryLink(text: string, target: string): void;
    public addEntryLink(
        text: string,
        clickHandler: (self: edomElement) => void
    ): void;

    public addEntryLink(
        text: string,
        doOnClick: string | ((self: edomElement) => void)
    ) {
        const anstrich: edomElement = edom.newElement('li');

        const link: edomAnchorElement = edom.newElement(
            'a'
        ) as edomAnchorElement;
        link.text = text;

        if (typeof doOnClick === 'string') {
            link.href(doOnClick);
        } else if (typeof doOnClick === 'function') {
            link.addClick('', () => {
                doOnClick(link);
            });

            link.href('javascript:void(0);');
        }

        anstrich.addChild(link);
        this.addChild(anstrich);
    }
}
// edomImageElement ==================================================================================
class edomImageElement extends edomElement {
    private _src: string = '';
    public get src(): string {
        return this._src;
    }
    public set src(src: string) {
        this._src = src;
        (this.element as HTMLImageElement).src = this.src;
    }
}
// edomLabelElement ==================================================================================
class edomLabelElement extends edomElement {
    private _for: string = '';
    public get for(): string {
        return this._for;
    }

    public set for(htmlFor: string) {
        this.for = htmlFor;
        (this.element as HTMLLabelElement).htmlFor = this.for;
    }
}
