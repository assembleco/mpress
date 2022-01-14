import React from "react"
import { observer } from "mobx-react"

import { keymap } from "@codemirror/view"
import { lineNumbers } from "@codemirror/gutter"
import { basicSetup } from "@codemirror/basic-setup"
import { defaultKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { schema } from "prosemirror-schema-basic"
import { CodeModel, CodeDisplay } from "./code"
import { ProseModel, ProseDisplay } from "./prose"
import { Node } from "prosemirror-model"

import parseXML from "@rgrove/parse-xml"

class Playground extends React.Component {
  state = {
    display: 'prose',
    code: {
      "doc": {
        "type": "doc",
        "content": [{
          "type": "paragraph",
          // "attrs": {
          //   "align": "left"
          // },
          "content": [{
            "type": "text",
            "text": "'hello'.",
          }]
        }]
      },
      "selection": {
        "type": "text",
        "anchor": 16,
        "head": 16
      }
    },
    errors: [],
    xml: null,
  }

  playgroundModel = null
  playgroundDisplay = null
  playgroundNode = null

  constructor(p) {
    super(p)
    this.playgroundNode = React.createRef()
    this.onLoadXML = this.onLoadXML.bind(this)
    this.changeDisplay = this.changeDisplay.bind(this)
    this.reloadDisplayOnCodeChange = this.reloadDisplayOnCodeChange.bind(this)
    this.grabCode()
  }

  componentDidMount() {
    if(this.state.display === 'code') {
      this.playgroundModel = CodeModel.create({
        doc: JSON.stringify(this.state.code, null, 2),
        extensions: [
          javascript({ config: { jsx: true } }),
          lineNumbers(),
          basicSetup,
          keymap.of(defaultKeymap)
        ]
      })

      this.playgroundDisplay =
        new CodeDisplay({
          state: this.playgroundModel,
          parent: this.playgroundNode.current,
        })
    } else {
      let contentNode = Node.fromJSON(schema, this.state.code.doc)
      this.playgroundModel = ProseModel.create({ schema, doc: contentNode })

      this.playgroundDisplay =
        new ProseDisplay(
          this.playgroundNode.current,
          { state: this.playgroundModel },
        )
    }

    this.reloadDisplayOnCodeChange()
  }

  componentDidUpdate(prev) {
    if(prev.address !== this.props.address)
      this.grabCode()
  }

  grabCode() {
    if(!this.props.address) return null

    fetch(`http://${process.env.REACT_APP_HIERARCH_ADDRESS}/source?address=${this.props.address}`)
    .then(response => response.text())
    .then(response => {
      this.setState({ code: response })
      this.reloadDisplayOnCodeChange()
    })
  }

  onLoadXML() {
    import("./BILLS-117hr2364rh.xml").then(module => {
      this.setState({ xml: module.default })
      this.parse_xml_json(module.default)
    })
  }

  reloadDisplayOnCodeChange() {
    var change = null

    if(this.state.display === 'code') {
      this.playgroundDisplay.destroy()

      this.playgroundModel = CodeModel.create({
        doc: JSON.stringify(this.state.code, null, 2),
        extensions: [
          javascript({ config: { jsx: true } }),
          lineNumbers(),
          basicSetup,
          keymap.of(defaultKeymap)
        ]
      })

      this.playgroundDisplay = new CodeDisplay({
        state: this.playgroundModel,
        parent: this.playgroundNode.current,
      })

      if(this.playgroundDisplay)
        this.playgroundDisplay.dispatch(change)
    } else {
      this.playgroundDisplay.destroy()

      this.playgroundModel = ProseModel.create({
        schema,
        doc: Node.fromJSON(schema, this.state.code.doc),
      })

      this.playgroundDisplay = new ProseDisplay(
        this.playgroundNode.current,
        { state: this.playgroundModel },
      )
    }
  }

  changeDisplay() {
    this.setState({ display: this.state.display === 'code' ? 'prose' : 'code' })
    this.reloadDisplayOnCodeChange()
  }

  parse_xml_json(xml) {
    var parsed = parseXML(xml)

    var record = {
      doc: {
        type: 'doc',
        content:
          parsed
          .children.filter(c => c.name === "bill")[0]
          .children.filter(c => c.name === "legis-body")[0]
          .children.filter(c => c.name === "section")
          .map(section => {
            try {
              return {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `
                    enum: ${phrase(drill(section, 'enum'))}
                    header: ${phrase(drill(section, "header"))}
                    body: ${phrase(drill(section, "text"))}
                    `,
                  }
                ]
              }
            } catch(e) {
              console.log(e)
              console.dir(section)
            }
        })
      }
    }

    this.setState({ code: record })

    setTimeout(this.reloadDisplayOnCodeChange, 250)
  }


  render() {
    return (
      <>
        <div style={{
          border: '4px solid black',
          borderRadius: '4px',
        }}>
          <div ref={this.playgroundNode} />
        </div>

        <button
        onClick={this.onLoadXML}
        style={{
          display: 'block',
          color: '#fffefe',
          background: '#6fa7ec',
          borderRadius: '0.8rem',
          height: '1.6rem',
        }}
        >
          Load XML.
        </button>

        <button
        onClick={this.changeDisplay}
        style={{
          display: 'block',
          color: '#fffefe',
          background: '#6fa7ec',
          borderRadius: '0.8rem',
          height: '1.6rem',
        }}
        >
          Change display: code / prose
        </button>

        {this.state.xml &&
          <div>
            <h3>Original USLM</h3>
            <pre><code>
            {this.state.xml}
            </code></pre>
          </div>
        }
      </>
    )
  }
}

function drill(node, name) {
  var responses = node.children.filter(c => c.name === name)
  if(responses.length === 0)
    return { children: [] }
  else
    return responses[0]
}

function phrase(node) {
  return node.children.map(c => c.text).join()
}

export default observer(Playground)
