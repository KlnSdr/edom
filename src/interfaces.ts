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
    value?: string;
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
    name?: string;
}

interface Component {
    render: (parent: edomElement) => void;
    instructions: () => edomTemplate;
    unload: () => void;
}
