<template>
  <div class="hero" v-bind:class="{ parentDiv: !isParent }">
    <div class="hero__title">
      {{ username }}
    </div>
    <div class="hero__content">
      {{ content }}
    </div>
    <button class="hero__btn" @click="Delete" v-if="String(curr_user_id) === String(user_id) || isMod">Delete</button>
    <button class="hero__btn" @click="Answer">Answer</button>
    <hr>
    <div class="hero__child" v-for="item in child" :key="item">
      <Comment :isMod = isMod :child = item.child :username= item.nickname :content = item.content :id = item.id :user_id = item.user_id></Comment>
    </div>
  </div>
</template>

<script>
import axios from "../axiosConfig";
export default {
  name: "Comment",
  data: function(){
    return{
      curr_user_id: Number,
    }
  },
  props:{
    username: String,
    content: String,
    id: Number,
    user_id: Number,
    child: Array,
    isParent: Boolean,
    isMod: Boolean
  },
  methods:{
    Delete() {
      if (confirm('Are you sure you want to delete this comment?')) {
        axios
            .delete(`http://localhost:3000/comments/${this.id}`)
            .then(() => {
            })
            .catch(() => console.log('nieok'))
      }
    },
    Answer() {
      this.emitter.emit("newRespond",  {id: this.id, username: this.username});
    }
  },
  mounted(){
    this.curr_user_id = localStorage.getItem('user')
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.parentDiv{
  margin: 0 !important;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
  width: auto !important;
}
.hero {
    height: 100%;
    width: 40%;
    border-radius: 5px;
    margin: auto auto;
    -webkit-box-shadow: 3px 3px 5px 6px $gray;
    -moz-box-shadow: 3px 3px 5px 6px $gray;
    box-shadow: 3px 3px 5px 6px $gray;
    padding-left: 1rem;
   @include tablet {
    height: 100%;
    width:90%;
  }
    &__child{
      padding: 0 !important;
      width: 100%;
    }
    &__title {
      font-weight: 800;
      text-align: left;
      font-size: 1rem;
      padding-left: 0.6rem;
      @include tablet {
        font-size: 0.8rem
      }
    }
    &__content {
      font-weight: 600;
      padding-left: 0.6rem;
      text-align: left;
      font-size: 0.8rem;
      padding-bottom: 1rem;
      overflow-wrap: break-word;
      @include tablet {
        font-size: 0.6rem
      }
    }
  &__btn {
    font-size: 0.6rem;
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