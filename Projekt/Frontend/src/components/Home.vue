<template>
  <Navbar></Navbar>
  <div class="middle">
    <SortBar @sortChange = 'sortPosts'></SortBar>
    <div v-if="posts.length === 0" class="center"> <span>No posts to show, consider joining a subreddit</span></div>
    <div v-for="item in posts" :key="item">
      <Post :surv_id = item.question_id :answers = item.answers :question = item.question :user_id = item.user_id :title = item.title :content = item.content :image_path=item.image_path :subreddit=item.name :user = item.nickname :id = item.id :vote = item.vote :vid = trim(item.video_url) :voteSum = item.sumvote ></Post>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Post from "./Post";
import axios from "../axiosConfig";
import SortBar from "./SortBar";
import io from '@/socketio'
export default {
  name: "Home",
  components: {SortBar, Navbar, Post},
  data: function(){
    return{
      posts: [],
      stats: [],

    }
  },
  methods:{
    trim(value){
      if(typeof value === 'string' || value instanceof String)
        return value.replace('watch?v=', 'embed/');
      return null
    },
    sortPosts(val){
      axios
          .get(`http://localhost:3000/posts/user/home/?sort=${val}`)
          .then(response =>{
            console.log(response.data)
            this.posts = response.data
          })
    }
  },
  mounted () {
    io.on(`deletePost/remove/fromHome`, (e) => {
      console.log(e)
      this.posts.splice(this.posts.findIndex(
          x => Number(x.id) === Number(e)
      ),1)
    })
    axios
        .get(`http://localhost:3000/posts/user/home/?sort=new`)
        .then(response =>{
          console.log(response)
          this.posts = response.data
        })
    axios
        .get(`http://localhost:3000/subreddit/stats/bestSubs`)
        .then(response =>{
          this.stats = response.data
        })
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.middle{
  padding-top: 2rem;
}
.center{
  margin: auto;
  text-align: center;
}
</style>