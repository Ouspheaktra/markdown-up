import React from "react";
import ReactDOM from "react-dom";
import MarkdownUp  from "../../../dist/markdown-up";

const mdu = new MarkdownUp("react");

function readTextFile(file, success) {
    var reader = new FileReader();
    reader.onload = e => success(e.target.result);
    reader.readAsText(file);
}

class HelloMessage extends React.Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
        this.state = {
            output: "NONE",
            lalal: 123
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
            <div>
                {this.state.output}
            </div>
        </div>;
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage />, mountNode);