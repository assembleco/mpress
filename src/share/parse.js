import parseXML, { XmlText} from "@rgrove/parse-xml"

var parse = (xml, callback) => {
  var parsed = parseXML(xml)

  process_hierarchy(parsed, (response) => {
    // console.log(JSON.stringify(response, null, 2))
    callback({ doc: { type: 'doc', content: response } })
  })
}

var process_hierarchy = (node, callback) => {
  if(node.name === 'text') console.dir(node)

  if(node.children) {

    var record = node.children.map(child => {
      if(child instanceof XmlText) return {
        type: 'text',
        text: child.text,
      }

      return process_hierarchy(child, grandchildren => {
        if(child.name === 'dublinCore') return null
        if(child.name === 'form') return null

        if(child.name === 'text') child.name = 'text_model'

        return {
          type: child.name.replace(/-/g, '_').replace(/:/g, '_'),
          content: grandchildren,
        }
      })
    }).filter(x => x)

    return callback(record)
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

export { parse }
