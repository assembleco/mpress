import {Schema} from "prosemirror-model"

var bill_dtd = new Schema({
  nodes: {
    doc: {
      content: 'bill',
    },
    bill: {
      content: 'metadata form legis_body endorsement',
      toDOM: () => (['div', { class: 'bill' }, 0]),
      parseDOM: [ { tag: 'div', class: 'bill' }, ]
    },

    metadata: {
      content: 'dublin_core?',
      toDOM: () => ['span', { class: 'metadata' }, 0],
      parseDOM: [{ tag: 'span', class: 'metadata' }],
    },
    dublin_core: {
      content: '',
      toDOM: () => ['span', { class: 'dublinCore' }, 0],
      parseDOM: [{ tag: 'span', class: 'dublinCore' }],
    },

    form: {
      content: ``, /*`
      distribution_code?
      calendar?
      congress
      session
      legis_num
      associated_doc
      current_chamber
      action*
      legis_type
      official_title
      `,*/
      toDOM: () => (['div', { class: 'form' }, 0]),
      parseDOM: [ { tag: 'div', class: 'form' }, ],
    },

    legis_body: {
      content: 'section*',
      toDOM: () => (['div', { class: 'legis-body' }, 0]),
      parseDOM: [ { tag: 'div', class: 'legis-body' } ],
    },

    endorsement: {
      content: 'action_date action_desc',
      toDOM: () => ['div', { class: 'endorsement' } ],
      parseDOM: [{ tag: 'div', class: 'endorsement' }],
    },

    section: {
      content: 'enum header text_model',
      toDOM: () => (['section', 0]),
      parseDOM: [ { tag: 'section' } ],
    },
    enum: {
      inline: true,
      content: 'text*',
      toDOM: () => ['span', { class: 'enum' }, 0],
      parseDOM: [{ tag: 'span', class: 'enum' }],
    },
    header: {
      inline: true,
      content: 'text*',
      toDOM: () => ['span', { class: 'header' }, 0],
      parseDOM: [{ tag: 'span', class: 'header' }],
    },

    action_date: {
      content: 'text*',
      toDOM: () => (['div', { class: 'action-date' }, 0]),
      parseDOM: [ { tag: 'div', class: 'action-date' } ],
    },
    action_desc: {
      content: 'text*',
      toDOM: () => (['div', { class: 'action-desc' }, 0]),
      parseDOM: [ { tag: 'div', class: 'action-desc' } ],
    },

    quote: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'quote' }, 0]),
      parseDOM: [ { tag: 'span', class: 'quote' } ],
    },
    subsection: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'subsection' }, 0]),
      parseDOM: [ { tag: 'span', class: 'subsection' } ],
    },

    short_title: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'short-title' }, 0]),
      parseDOM: [ { tag: 'span', class: 'short-title' } ],
    },

    italic: {
      content: 'text*',
      toDOM() { return ["i", 0] },
      parseDOM: [{tag: "i"}]
    },

    paragraph: {
      content: '(text_model | subparagraph)*',
      toDOM() { return ["p", 0] },
      parseDOM: [{tag: "p"}]
    },
    subparagraph: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'subparagraph' }, 0]),
      parseDOM: [ { tag: 'span', class: 'subparagraph' } ],
    },

    quoted_block: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'quoted-block' }, 0]),
      parseDOM: [ { tag: 'span', class: 'quoted-block' } ],
    },

    after_quoted_block: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'after-quoted-block' }, 0]),
      parseDOM: [ { tag: 'span', class: 'after-quoted-block' } ],
    },

    external_xref: {
      inline: true,
      content: 'text*',
      toDOM: () => (['span', { class: 'external-xref' }, 0]),
      parseDOM: [ { tag: 'span', class: 'external-xref' } ],
    },

    text_model: {
      inline: true,
      content: '(text | quote | subsection | external_xref)*',
      toDOM: () => ['span', { class: 'text_model' }, 0],
      parseDOM: [{ tag: 'span', class: 'text_model' }],
    },
    text: { },
  },
})

export { bill_dtd }
