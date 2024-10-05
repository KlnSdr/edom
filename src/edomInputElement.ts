class edomInputElement extends edomElement {
    private _value: string = "";
    public get value(): string {
        return this._value;
    }

    public set value(val: string) {
        this._value = val;
        (this.element as HTMLInputElement).value = val;
    }

    private _type: string = "text";
    public get type(): string {
        return this._type;
    }
    public set type(type: string) {
        this._type = type;
        (this.element as HTMLInputElement).type = type;
    }

    private _name: string = "";
    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
        (this.element as HTMLInputElement).name = name;
    }

    private _checked: boolean = false;
    public get checked(): boolean {
        return this._checked;
    }
    public set checked(state: boolean) {
        this._checked = state;
        (this.element as HTMLInputElement).checked = state;
    }

    private _groupID: string = "";
    public get groupID(): string {
        return this._groupID;
    }
    public set groupID(id: string) {
        this._groupID = id;
        (this.element as HTMLInputElement).name = this._groupID;
    }

    public addChange(identifier: string, func: (self: this) => any) {
        this.addEvent("input", identifier, (self) => {
            func(self);
        });
    }

    public deleteChange(identifier: string) {
        this.deleteEvent("input", identifier);
    }

    public select() {
        (this.element as HTMLInputElement).select();
    }
}
