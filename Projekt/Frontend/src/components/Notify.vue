<template>
  <div class="notify">
    <p>{{notifyObj.comment.nickname}} commented </p>
    <span>{{ content }}</span>
    <span> on your post {{notifyObj.post.title}} </span>
    <a @click="goToPost"><font-awesome-icon icon="arrow-alt-circle-right"/></a>
  </div>
</template>

<script>
export default {
  name: "Notify",
  props:{
    notifyObj: Object,
  },
  methods:{
    goToPost(){
      this.$router.push('/post/'+ this.notifyObj.post.id)
    },
  },
  computed:{
    content: function () {
      if(this.notifyObj.comment.content.length > 10)
        return this.notifyObj.comment.content.substring(0,10)+'...'
      else
        return this.notifyObj.comment.content
    }
  }
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
.notify{
  height: auto;
  width: auto;
  min-width: 30vh;
  z-index: 100;
  border-radius: 0.5rem;
  position: absolute;
  background-color: $notifyColor;
  margin-left: auto;
  -webkit-box-shadow: 3px 3px 5px 6px $gray;
  -moz-box-shadow:    3px 3px 5px 6px $gray;
  box-shadow:         3px 3px 5px 6px $gray;
  font-size: 1rem;
  @include tablet {
    font-size: 0.8rem;
    height: auto;
    width: auto;
  }
  margin-top: 2%;
  p{
    padding-left: 1rem;
    padding-right: 1rem;
    font-weight: bold;
  }
  span{
    padding-bottom: 0.1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  a{
    float: right;
    padding-right: 0.5rem;
    cursor: pointer;
  }
}
</style>