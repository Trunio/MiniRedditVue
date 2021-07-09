<template>
  <div class="searchbar">
    <input type="text" placeholder="Type here" v-model="input" @input=emit(this.input)>
    <div class="result">
      <div class="result--item" v-for="item in results" :key="item">
        <a :href=item.link> {{item.name}} </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data: function(){
    return {
      input: '',
      type: '',
    }
  },
  props:{
    results: Array,
  },
  methods:{
    emit(e) {
      this.$emit('onChange', e);
    }
  },
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
.searchbar {
  position: relative;
  @include tablet {
    width: 100%;
  }
  input {
    font-size: 1rem;
    color: $dark;
    font-weight: 700;
    padding: 0.1rem;
    width: 30vw;
    box-shadow: 0 0 15px 4px $semiLight;
    border-color: $semiLight;
    border-radius: 0.5rem;
  }

  .result {
    width: 30vw;
    position: absolute;
    z-index: 100;

    &--item {
      border-radius: 0.5rem;
      background-color: $transparanetGray;
      position: relative;
      a{
        font-size: 1rem;
        @include tablet {
          font-size: 0.4rem;
        }
      }
    }
  }
}
</style>