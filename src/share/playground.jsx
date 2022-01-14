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
    code: "'hello'",
    errors: [],
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

    if(this.state.display === 'code') {
      this.playgroundModel = CodeModel.create({
        doc: this.state.code,
        extensions: [
          javascript({ config: { jsx: true } }),
          lineNumbers(),
          basicSetup,
          keymap.of(defaultKeymap)
        ]
      })
    } else {
      let content = {
        "doc": {
          "type": "doc",
          "content": [{
            "type": "paragraph",
            "attrs": {
              "align": "left"
            },
            "content": [{
              "type": "text",
              "text": this.state.code
            }]
          }]
        },
        "selection": {
          "type": "text",
          "anchor": 16,
          "head": 16
        }
      }

      let contentNode = Node.fromJSON(schema, content.doc)

      this.playgroundModel = ProseModel.create({
        schema,
        doc: contentNode,
      })
    }
  }

  componentDidMount() {
    this.playgroundDisplay = (
      this.state.display === 'code'
      ?
      new CodeDisplay({
        state: this.playgroundModel,
        parent: this.playgroundNode.current,
      })

      :
      new ProseDisplay(
        this.playgroundNode.current,
        { state: this.playgroundModel },
      )
    )

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
      this.parse_xml_json(module.default)
    })
  }

  reloadDisplayOnCodeChange() {
    if(this.state.display === 'code') {
      var change = this.playgroundModel.update({changes: {
        from: 0,
        to: this.playgroundModel.doc.length,
        insert: this.state.code,
      }})

      if(this.playgroundDisplay)
      this.playgroundDisplay.dispatch(change)
    }
  }

  changeDisplay() {
    var originalDisplay = this.state.display
    this.setState({ display: this.state.display === 'code' ? 'prose' : 'code' })

    if(originalDisplay === 'prose') {
      this.playgroundModel = CodeModel.create({
        doc: JSON.stringify(this.state.code, null, 2),
        extensions: [
          javascript({ config: { jsx: true } }),
          lineNumbers(),
          basicSetup,
          keymap.of(defaultKeymap)
        ]
      })

      this.playgroundDisplay.destroy()
      this.playgroundDisplay = new CodeDisplay({
        state: this.playgroundModel,
        parent: this.playgroundNode.current,
      })
    } else {
      this.playgroundModel = ProseModel.create({
        schema,
        doc: Node.fromJSON(schema, JSON.parse(this.state.code)),
      })

      this.playgroundDisplay.destroy()
      this.playgroundDisplay = new ProseDisplay(
        this.playgroundNode.current,
        { state: this.playgroundModel },
      )
    }

    setTimeout(this.reloadDisplayOnCodeChange, 250)
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
                    class: ${phrase(drill(section, 'enum'))}
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
