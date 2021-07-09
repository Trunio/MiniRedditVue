<template>
  <Navbar></Navbar>
  <div class="back">
    <div class="back__container">
      <h1 class="back__title">{{title}}</h1>
      <button class="back__container--btn" @click="callAction"><a>{{action}}</a></button>
      <button class="back__container--btn" @click="goToPostForm()">
        <a><font-awesome-icon icon="plus-circle" /></a>
      </button>
      <button class="back__container--btn" @click="goToEdit()" v-if="isMod">
        <a><font-awesome-icon icon="edit" /></a>
      </button>
      <button class="back__container--btn" @click="modPanel = !modPanel" v-if="isMod">
        <a>Mods</a>
      </button>
    </div>
  </div>
  <ModeratorPanel v-if="modPanel" :users="mods"></ModeratorPanel>
  <div v-if="!modPanel">
    <Description :text = 'description'></Description>
    <SubredditSortBar @viewChange="changeView" @nextChange="next"></SubredditSortBar>
    <div  v-if="String(listing) === 'list'" >
      <div v-for="item in posts" :key="item">
        <Post :isMod = isMod :surv_id = item.question_id :answers = item.answers :question = item.question :user_id = item.user_id :voteSum = item.sumvote :title = item.title :content = item.content :image_path=item.image_path :subreddit=item.name :user = item.nickname :id = item.id :vote = item.vote :vid = trim(item.video_url)></Post>
      </div>
    </div>
    <div  v-if="String(listing) === 'card'" >
      <Post :isMod = isMod :user_id = posts[index].user_id :voteSum = posts[index].sumVote :title = posts[index].title :content = posts[index].content :image_path=posts[index].image_path :subreddit=posts[index].name :user = posts[index].nickname :id = posts[index].id :vote = posts[index].vote :vid = trim(posts[index].video_url)></Post>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Post from "./Post";
import axios from "../axiosConfig";
import Description from "./Description";
import SubredditSortBar from "./SubredditSortBar";
import ModeratorPanel from "./ModeratorPanel";
import io from '@/socketio'
export default {
  name: "Subreddit",
  components: {ModeratorPanel, SubredditSortBar, Navbar, Post, Description},
  data: function(){
    return{
      title:'',
      description: 'test',
      action: '',
      posts: [],
      isMod: Boolean,
      listing: 'list',
      index: Number,
      modPanel: false,
      mods: []
    }
  },
  methods:{
    next(e){
      if(e === 'right'){
        if(this.index < this.posts.length)
          this.index++
      }else{
        if(this.index > 0){
          this.index--
        }
      }
    },
    changeView(e){
      this.listing = e;
      if(e === 'card'){
        this.index = 0
      }
    },
    goToEdit(){
      this.$router.push(`/subredditFormEdit/${this.$route.params.name}`)
    },
    goToPostForm() {
      this.$router.push(`/subreddit/${this.$route.params.name}/create`)
    },
    callAction() {
      axios
          .post(`http://localhost:3000/subreddit/${this.$route.params.name}/join`)
          .then(response =>{
            if(response.data.length > 0)
              this.action = 'Join'
            else
              this.action = 'Leave'
          })
    },
    trim(value){
      if(typeof value === 'string' || value instanceof String)
        return value.replace('watch?v=', 'embed/');
      return null
    }
  },
  mounted () {
    io.on(`deletePost/remove/fromSubreddit`, (e) => {
      console.log(e)
      console.log('test')
      this.posts.splice(this.posts.findIndex(
          x => Number(x.id) === Number(e)
      ),1)
    })
    axios
        .get(`http://localhost:3000/subreddit/${this.$route.params.name}`)
        .then(response =>{
          console.log(response.data)
          this.title = response.data[0].name;
          this.description = response.data[0].description;
        })
    axios
        .get(`http://localhost:3000/subreddit/${this.$route.params.name}/checkSub`)
        .then(response =>{
          if(response.data.length > 0)
            this.action = 'Leave'
          else
            this.action = 'Join'
        })
    axios
        .get(`http://localhost:3000/posts/${this.$route.params.name}`)
        .then(response =>{
          this.posts = response.data
          console.log(response.data)
          console.log(this.posts)
        })
    axios
        .get(`http://localhost:3000/subreddit/${this.$route.params.name}/checkMod`)
        .then(() => this.isMod = true )
        .catch(() => this.isMod = false)
    axios
        .get(`http://localhost:3000/subreddit/${this.$route.params.name}/getMods`)
        .then((res) => this.mods = res.data )
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
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
      font-size: 1.5rem;
    }
    @include mobile {
      font-size: 1.5rem;
    }
  }
}
</style>