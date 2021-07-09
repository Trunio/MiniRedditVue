<template>
  <div class="desc">
    <div class="desc__container">
      <span>Best Communities</span>
      <div class="desc__container__stats">
        <div v-for="item in subs" :key="item">
          <div class="desc__container__stats__title"><a :href="'/subreddit/' + item.name">{{ item.name }}</a></div>
          <div class="desc__container__stats__wrapper">
            <div>Posts: {{ item.posts }} Members: {{item.users}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsBar",
  data: function(){
  },
  props: {
    subs: []
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
    -webkit-box-shadow: 3px 3px 5px 6px $darkGreen;
    -moz-box-shadow:    3px 3px 5px 6px $darkGreen;
    box-shadow:         3px 3px 5px 6px $darkGreen;
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