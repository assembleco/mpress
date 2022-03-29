import {Schema} from "prosemirror-model"

var bill_dtd = new Schema({
  nodes: {
    doc: {
      content: 'bill',
    },
    bill: {
      content: 'metadata form legisBody endorsement',
      toDOM: () => (['div', { class: 'bill' }, 0]),
      parseDOM: [ { tag: 'div', class: 'bill' }, ]
    },

    metadata: { content: 'dublinCore?', },
    dublinCore: { content: '', },

    form: {
      content: ``, /*`
      distributionCode?
      calendar?
      congress
      session
      legisNum
      associatedDoc
      currentChamber
      action*
      legisType
      officialTitle
      `,*/
      toDOM: () => (['div', { class: 'form' }, 0]),
      parseDOM: [ { tag: 'div', class: 'form' }, ],
    },

    legisBody: {
      content: 'section*',
      toDOM: () => (['div', { class: 'legis-body' }, 0]),
      parseDOM: [ { tag: 'div', class: 'legis-body' } ],
    },

    endorsement: {
      content: 'actionDate actionDesc',
      toDOM: () => ['div', { class: 'endorsement' } ],
      parseDOM: [{ tag: 'div', class: 'endorsement' }],
    },

    section: {
      content: 'enum header phrase',
      toDOM: () => (['section', 0]),
      parseDOM: [ { tag: 'section' } ],
    },
    enum: {
      content: 'phrase',
      toDOM: () => ['span', { class: 'enum' }, 0],
      parseDOM: [{ tag: 'span', class: 'enum' }],
    },
    header: {
      content: 'phrase',
      toDOM: () => ['span', { class: 'header' }, 0],
      parseDOM: [{ tag: 'span', class: 'header' }],
    },
    text: {
      content: '(phrase | quote | subsection)*',
      toDOM: () => ['span', { class: 'text' }, 0],
      parseDOM: [{ tag: 'span', class: 'text' }],
    },

    actionDate: {
      content: 'phrase',
      toDOM: () => (['div', { class: 'action-date' }, 0]),
      parseDOM: [ { tag: 'div', class: 'action-date' } ],
    },
    actionDesc: {
      content: 'phrase',
      toDOM: () => (['div', { class: 'action-desc' }, 0]),
      parseDOM: [ { tag: 'div', class: 'action-desc' } ],
    },

    quote: {
      content: 'phrase',
      toDOM: () => (['span', { class: 'quote' }, 0]),
      parseDOM: [ { tag: 'span', class: 'quote' } ],
    },
    subsection: {
      content: 'phrase',
      toDOM: () => (['span', { class: 'subsection' }, 0]),
      parseDOM: [ { tag: 'span', class: 'subsection' } ],
    },

    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() { return ["p", 0] },
      parseDOM: [{tag: "p"}]
    },

    phrase: {
      group: "inline",
    },
  },
})

export { bill_dtd }
