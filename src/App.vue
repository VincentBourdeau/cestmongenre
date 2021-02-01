<template>
  <div id="app">
    <div class="main-wrapper fluid-container">
      <router-view />
    </div>

    <new-content-available-toastr
      v-if="newContentAvailable"
      class="new-content-available-toastr"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available-toastr>
    <apple-add-to-home-screen-modal
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
    >
    </apple-add-to-home-screen-modal>
  </div>
</template>
<script>
import NewContentAvailableToastr from '@/components/NewContentAvailableToastr'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { NewContentAvailableToastr, AppleAddToHomeScreenModal },
  computed: {
    ...mapGetters('app', ['newContentAvailable']),
    ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp'])
  },
  mounted() {
    const fixAppHeight = () => {
      const el = document.querySelector('#app')
      el.style.setProperty('height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', fixAppHeight)
    fixAppHeight()
  },
  methods: mapActions('app', ['closeAddToHomeScreenModalForApple', 'serviceWorkerSkipWaiting'])
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body,
main,
#app {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  /* mobile viewport bug fix */
  height: -webkit-fill-available;
  background: #faf8fa;
  color: #596778;
}

.main-wrapper {
  width: 100%;
  height: 100%;
}

.max-container {
  width: 100%;
  height: 100%;
  max-width: 365px;
  margin: 0 auto;

  transform: scale(0.945);

  @media (min-width: 500px) {
    max-width: 425px;
    transform: none;
  }
}
</style>
