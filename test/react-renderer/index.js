import React from "react";
import ReactDOM from "react-dom";
import { MarkdownUp, ReactRenderer } from "../../src/index";

const mdu = new MarkdownUp(ReactRenderer);

function readTextFile(file, success) {
    var reader = new FileReader();
    reader.onload = e => success(e.target.result);
    reader.readAsText(file);
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
        this.state = {
            output: "NONE"
        }
    }
    selectFile(e) {
        readTextFile(e.target.files[0], md => {
            let tokens = mdu.parse(md);
            let rendered = mdu.render(tokens);
            this.setState({ output: rendered });
        });
    }
    render() {
        return <div>
            <input type="file" id="file" onChange={this.selectFile.bind(this)} />
            {React.createElement('div', null, ...this.state.output)}
        </div>;
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);