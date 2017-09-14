import hljs from 'highlight.js'
import 'highlight.js/styles/tomorrow.css'

let Highlight = {}
Highlight.install = function(Vue, options) {
  Vue.directive('highlight', function(el) {
    let blocks = el.querySelectorAll('blockquote')
    blocks.forEach(block => {
      hljs.highlightBlock(block)
    })
  })
}

export default Highlight
