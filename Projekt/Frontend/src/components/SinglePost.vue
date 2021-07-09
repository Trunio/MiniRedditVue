<template>
  <Navbar></Navbar>
  <Post :isMod = isMod v-if="post.title" :surv_id = post.question_id :answers = post.answers :question = post.question  :user_id = post.user_id :voteSum = post.sumvote :title = post.title :content = post.content :image_path=post.image_path :subreddit=post.name :user = post.nickname :id = post.id :vote = post.vote :vid = trim(post.video_url) ></Post>
  <CommentForm></CommentForm>
  <div v-for="item in comments" :key="item">
    <Comment :isMod = isMod :isParent =  true :child = item.child :username= item.nickname :content = item.content :id = item.id :user_id = item.user_id></Comment>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import axios from "../axiosConfig";
import Post from "./Post";
import Comment from "./Comment"
import CommentForm from "./CommentForm"
import io from '@/socketio'
export default {
  name: "SinglePost",
  components: {Navbar, Post, Comment, CommentForm},
  data: function(){
    return{
      post: {},
      test: 'test',
      comments: [],
      isMod: false
    }
  },
  methods:{
    goToPostForm() {
      this.$router.push(`/subreddit/${this.$route.params.name}/create`)
    },
    respond(e){
      this.respondId = e.id;
      this.respondUsername = e.username;
    },
    trim(value){
      if(typeof value === 'string' || value instanceof String)
        return value.replace('watch?v=', 'embed/');
      return null
    }
  },
  mounted () {
    axios
        .get(`http://localhost:3000/posts/single/${this.$route.params.id}`)
        .then(response =>{
          this.post = response.data[0]
          axios
              .get(`http://localhost:3000/subreddit/${this.post.name}/checkMod`)
              .then(() => this.isMod = true )
              .catch(() => this.isMod = false)
        })
    axios
        .get(`http://localhost:3000/comments/${this.$route.params.id}`)
        .then(response =>{
          this.comments = response.data
        })
    io.on(`deletePost/${this.$route.params.id}/remove`, () => {
      this.$router.push(`/`)
    })
    io.on(`post/${this.$route.params.id}/new`, (e) => {
      function checkNested(arr) {
        arr.forEach(val => {
          if(val.id === e[0].parent_comment_id){
            if(!val.child)
              val.child = []
            val.child.push(e[0])
            return
          }
          if(val.child){
            checkNested(val.child)
          }
        })
      }
      if(!e[0].parent_comment_id) {
        this.comments.unshift(e[0])
        return
      }
      checkNested(this.comments)
    })
    io.on(`post/${this.$route.params.id}/remove`, (e) => {
      function checkNested(arr) {
        arr.forEach((val, id, arr) => {
          if(val.id === e[0].id){
            arr.splice(arr.findIndex(
                x => x.id === index
            ),1)
            return
          }
          if(val.child){
            checkNested(val.child)
          }
        })
      }
      let index = e[0].id
      if(!e[0].parent_comment_id) {
        this.comments.splice(this.comments.findIndex(
            x => x.id === index
        ),1)
        return
      }
      checkNested(this.comments)
    })
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.footer{
  width: 100%;
  background-color: $darkGreen;
  height: 5vh;
  position:fixed;
  bottom:0;
}
.back {
  &__container {
    height: 20vh;
    min-height: 150px;
    max-height: 150px;
    align-items: center;
    justify-items: center;
    margin: auto;
    width: 100%;
    background-color: $green;
    text-align: center;

    &--btn {
      font-size: 1rem;
      background-color: $lime;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      color: $light;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      margin-left: 0.5rem;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;
      outline: none;
    }
    &--btn a {
      position: relative;
      z-index: 2;
      color: $light;
      text-decoration: none;
    }
    &--btn:after {
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
    &--btn:hover:after {
      width: 100%;
    }
  }
  &__title{
    @extend %align-center-text;
    text-align:center;
    font-size: 3.5rem;
    font-weight: 1100;
    padding-top: 1rem;
    color: $semiLight;
    @include tablet {
      font-size: 2.5rem;
    }
    @include mobile {
      font-size: 1.5rem;
    }
  }
}
</style>