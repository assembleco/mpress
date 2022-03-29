import parseXML from "@rgrove/parse-xml"

var parse = (xml, callback) => {
  var parsed = parseXML(xml)
  process_hierarchy(parsed, (response) => {
    callback({
      doc: {
        type: 'doc',
        content: response
      }
    })
  })
}

var process_hierarchy = (node, callback) => {
  var record =
    node
    .children.filter(c => c.name === "bill")[0]
    .children.filter(c => c.name === "legis-body")[0]
    .children.filter(c => c.name === "section")
    .map(section => {
      try {
        return {
          type: 'section',
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
