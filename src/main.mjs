import App from './App.svelte'
let message = '...loading'

const app = new App({
  target: document.body,
  props: {
    message
  }
})

export default app
