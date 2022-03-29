import parseXML from "@rgrove/parse-xml"

var parse = (xml, callback) => {
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

  callback(record)
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

export { parse }
