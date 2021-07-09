<template>
  <div class="hero">
    <div class="hero__content">
      <textarea v-model='content' placeholder="Write comment here"></textarea>
    </div>
    <button class="hero__btn" @click="Create">Create</button>
    <span v-if="respondId" @click="removeRespond"> Respond to {{respondUsername}} X</span>
  </div>
</template>

<script>
import axios from "../axiosConfig";
export default {
  name: "CommentForm",
  data: function(){
    return{
      content:'',
      respondId: null,
      respondUsername: null
    }
  },
  methods:{
    Create() {
      if(this.content !== "") {
        axios
            .post(`http://localhost:3000/comments/${this.$route.params.id}`, {
              content: this.content,
              parent: this.respondId
            })
            .then(() => {
              this.content = '';
            })
            .catch(() => console.log('nieok'))
      }
    },
    removeRespond(){
      this.respondUsername = null;
      this.respondId = null;
    }
  },
  mounted() {
    this.emitter.on("newRespond", e => {
      this.respondUsername = e.username;
      this.respondId = e.id
    });
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.hero {
  align-items: center;
  justify-items: center;
  width: 40%;
  border-radius: 5px;
  margin: auto auto 1rem;
  -webkit-box-shadow: 3px 3px 5px 6px $gray;
  -moz-box-shadow: 3px 3px 5px 6px $gray;
  box-shadow: 3px 3px 5px 6px $gray;
  span{
    font-size: 0.8rem;
    color: $blue;
    cursor: pointer;
  }
  @include tablet {
    height: 100%;
    width:90%;
  }
  &__content {
    padding: 0.3rem;
    textarea {
      font-size: 1rem;
      text-align: left;
      font-weight: 700;
      display: block;
      resize: none;
      height: 100%;
      width: 100%;
      border: none;
      overflow: scroll;
      overflow-x: hidden;
      @include mobile {
        font-size: 1rem;
      }
    }
  }
  &__btn {
    font-size: 1rem;
    background-color: $lime;
    margin-left: 1rem;
    border: none;
    border-radius: 4px;
    color: $light;
    cursor: pointer;
    position: relative;
    margin-bottom: 0.2rem;
    transition: all 0.3s;
    outline: none;
  }
  &__btn:after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: $orangeRed;
    transition: all 0.3s;
    border-radius: 4px;
  }
  &__btn:hover:after {
    width: 100%;
  }
}

</style>