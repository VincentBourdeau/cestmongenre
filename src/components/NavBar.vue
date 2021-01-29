<template>
  <header class="navbar" :class="{ offline: !networkOnLine }"></header>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle'])
  },
  methods: {
    async logout() {
      await firebase.auth().signOut()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
