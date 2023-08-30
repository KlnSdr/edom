interface Component {
    render: (parent: edomElement) => void;
    instructions: () => edomTemplate;
    unload: () => void;
}
