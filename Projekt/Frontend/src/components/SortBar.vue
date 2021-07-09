<template>
  <div class="sortbar">
    <a  class="sortbar--links" @click="emit('new')" v-bind:class="{ select: selected === 'new'}">New</a>
    <a  class="sortbar--links" @click="emit('hot')" v-bind:class="{ select: selected === 'hot' }">Hot</a>
    <a  class="sortbar--links" @click="emit('best')" v-bind:class="{ select: selected === 'best' }">Best</a>
    <a  class="sortbar--links" @click="emit('controversial')" v-bind:class="{ select: selected === 'controversial' }">Controversial</a>
  </div>
</template>

<script>
export default {
  name: "SortBar",
  data: function(){
    return {
      selected: '',
    }
  },
  methods:{
    emit(e) {
      this.selected = e
      this.$emit('sortChange', e);
    }
  },
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
.select {
  background-color: $transparanetGray !important;
}
.sortbar {
  height: 5vh;
  width: 40%;
  background-color: white;
  margin: auto;
  box-shadow: 0 0 15px 4px $gray;
  border-color: $semiLight;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include tablet {
    width: 90%;
  }
  &--links {
    color: $dark;
    justify-content: center;
    text-decoration: none;
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    &:hover {
      color: $lime;
      transition: all 0.3s ease;
      cursor: pointer;
      text-align: center;
      vertical-align: middle;
    }
    @include tablet {
      font-size: 0.8rem;
      padding: 0 0.5rem;
    }
  }
}
</style>