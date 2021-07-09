<template>
  <div class="desc">
    <div class="desc__container">
      <input type="text" placeholder="Type here" v-model="input" @input=emit(this.input)>
      <div class="result">
        <div class="result--item" v-for="item in results" :key="item">
          <a :href=item.link> {{item.nickname}} </a>
        </div>
      </div>
      <div class="result">
        <div class="result--item" v-for="item in users" :key="item">
          <div v-if="item.nickname !== 'deleted user'"> {{item.nickname}} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModeratorPanel",
  data: function(){
    return {
      input: '',
      results: []
    }
  },
  props: {
    users: []
  },
  methods:{
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.desc {
  @extend %align-center;
  &__container {
    height: auto;
    width: 40vw;
    align-items: center;
    justify-items: center;
    margin: auto;
    background-color: white;
    border-radius: 5px;
    -webkit-box-shadow: 3px 3px 5px 6px $light;
    -moz-box-shadow:    3px 3px 5px 6px $light;
    box-shadow:         3px 3px 5px 6px $light;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    &__stats{
      justify-content: center;
      width: auto;
      height: auto;
      &__title{
      }
      &__wrapper{
      }
    }
    @include tablet {
      width: 80vw;
    }
    span{
      font-weight: 700;
      padding-bottom: 0.5rem;
    }
    &__text{
      margin: auto;
      border-radius: 5px;
      width: 85%;
      height: 85%;
      vertical-align: middle;
      background-color: $light;
      text-align: start;
    }
  }
}
</style>