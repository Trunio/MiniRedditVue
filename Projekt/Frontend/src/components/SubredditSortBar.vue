<template>
  <div class="sortbar">
    <a  class="sortbar--links" @click="emit('list')">List</a>
    <a  class="sortbar--links" @click="next('left')" v-if="selected === 'card'">Previous</a>
    <a  class="sortbar--links" @click="next('right')"  v-if="selected === 'card'">Next</a>
    <a  class="sortbar--links" @click="emit('card')">Card</a>
  </div>
</template>

<script>
export default {
  name: "SubredditSortBar",
  data: function(){
    return {
      selected: ''
    }
  },
  methods:{
    emit(e) {
      this.selected = e
      this.$emit('viewChange', e);
    },
    next(e) {
      this.$emit('nextChange', e);
    }
  },
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
.sortbar {
  height: 5vh;
  width: 40%;
  background-color: white;
  margin: auto;
  margin-top: 1rem;
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