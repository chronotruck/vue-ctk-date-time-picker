/**
 * FIXME: Use ndelvalle/v-click-outside when it will be ready to use with vue3.
 */
// Source: https://github.com/ndelvalle/v-click-outside/issues/238#issuecomment-713872610
export const directive = {
  beforeMount (el, binding) {
    // Define ourClickEventHandler
    const ourClickEventHandler = event => {
      if (!el.contains(event.target) && el !== event.target) {
        // as we are attaching an click event listern to the document (below)
        // ensure the events target is outside the element or a child of it
        binding.value(event) // before binding it
      }
    }
    // attached the handler to the element so we can remove it later easily
    el.__vueClickEventHandler__ = ourClickEventHandler

    // attaching ourClickEventHandler to a listener on the document here
    document.addEventListener('click', ourClickEventHandler)
  },
  unmounted (el) {
    // Remove Event Listener
    document.removeEventListener('click', el.__vueClickEventHandler__)
  }
}
