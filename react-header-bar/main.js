class Main extends React.Component {
    render() {
        return React.createElement('div', null, `header bar`);
    }
}

ReactDOM.render(
    React.createElement(Main, {toWhat: 'World'}, null),
    document.getElementById('header-bar')
);