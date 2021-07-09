<template>
  <div class="desc">
    <div class="desc__container">
      <span>Description</span>
      <div class="desc__container__text">
        {{text}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Description",
  data: function(){
  },
  props: {
    text: String
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
    width: 60%;
    align-items: center;
    justify-items: center;
    margin: auto;
    background-color: $semiLight;
    border-radius: 5px;
    -webkit-box-shadow: 3px 3px 5px 6px $darkGreen;
    -moz-box-shadow:    3px 3px 5px 6px $darkGreen;
    box-shadow:         3px 3px 5px 6px $darkGreen;
    padding-bottom: 1rem;
    @include tablet {
      width: 80vw;
    }
    span{
      font-weight: 700;
    }
    &__text{
      margin: auto;
      border-radius: 5px;
      width: 85%;
      height: 85%;
      vertical-align: middle;
      background-color: $lightGray;
      text-align: start;
    }
  }
}
</style>