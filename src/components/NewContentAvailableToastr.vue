<template>
  <div class="wrapper">
    <template v-if="refreshingApp">
      Chargement...
    </template>
    <template v-else>
      Nouveau contenu disponible
      <span class="refresh-btn" @click="$emit('refresh')">Recharger la page</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    refreshingApp: Boolean
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  left: 20px;
  z-index: 99;

  width: auto;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  display: inline-block;
  border-radius: 4px;

  .refresh-btn {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
