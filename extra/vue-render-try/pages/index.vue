<!--- <template>
  <section class="container">
    <div>
      <app-logo/>
      <h1 class="title">
        vue-render-try
      </h1>
      <h2 class="subtitle">
        Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green">Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template> -->

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  data() {
    return {
      items: ['item1', 'item2'],
      test: false,
    }
  },
  components: {
    AppLogo
  },
  beforeUpdate() {
    console.log('beforeUpdate',this.items);
  },
  render(h) {
    console.log('render',this.items);
    const test = this.items.join('-');
    const div =h('div',{
      key: 'div',
      attrs: {id: 'div'} 
    },[h('app-logo', {props:{
      test,
    }}),
      h('ul',this.items.map(i => h('li',{key: i, attrs: { id: i}},i))),
      h('button',{on: {click: this.itemChange}}, 'change')]);
    return this.test ? h('div',{style: {background: '#F00'}}, [div]) : div;
  },
  methods: {
    itemChange() {
      this.items = ['item2', 'item1'];
      // this.test =true;
      // setTimeout(() => {
        // this.items = ['item1', 'item2'];
        // this.test = false;
      // },1);
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
