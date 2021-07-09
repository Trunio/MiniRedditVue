<template>
  <div v-if="notification">
    <Notify :notifyObj = newNotify></Notify>
  </div>
  <nav class="navbar">
    <a href="/" class="navbar__logo">MicroReddit</a>
    <div class="navbar__menu">
      <SearchBar :results = results @onChange = 'handleChange'></SearchBar>
      <select v-model="type">
        <option value="Posts" selected>Posts</option>
        <option value="Subs">Subs</option>
      </select>
      <a href="/subredditForm" class="navbar__menu--links"><font-awesome-icon icon="plus-circle" /></a>
      <a  class="navbar__menu--links" @click="goToEdit">Profile</a>
      <a  class="navbar__menu--links" @click="goToAdmin" v-if="isAdmin">Admin</a>
      <a href="/" class="navbar__menu--links" id="button" @click="Logout"><font-awesome-icon icon="door-open"/></a>
    </div>
  </nav>
</template>

<script>
import SearchBar from "./SearchBar";
import axios from "../axiosConfig";
import io from '@/socketio'
import Notify from "./Notify";
export default {
  name: "Navbar",
  components: {Notify, SearchBar},
  data: function() {
    return {
      results: [],
      type: 'Posts',
      isAdmin: false,
      notification: false,
      newNotify: {}
    }
  },
  methods:{
    showAlert() {
      this.notification = true;
      setTimeout(() => this.notification = false, 7000);
    },
    handleChange(e){
      if(e !== '') {
        if(this.type === 'Subs'){
        axios
            .get(`http://localhost:3000/subreddit/home/search?name=${e.toLowerCase()}`)
            .then((res) => {
              res.data.forEach(function (value, i) {
                res.data[i].link = `http://localhost:8080/subreddit/${value.name}`
              });
              this.results = res.data
            })
            .catch(() => console.log('no results'))
          }
        if(this.type === 'Posts'){
          axios
              .get(`http://localhost:3000/posts/home/search?name=${e.toLowerCase()}`)
              .then((res) => {
                res.data.forEach(function (value, i) {
                  res.data[i].link = `http://localhost:8080/post/${value.id}`
                  res.data[i].name = value.title
                });
                this.results = res.data
              })
              .catch(() => console.log('no results'))
        }
      }else{
        this.results = [];
      }
    },
    Logout(){
      localStorage.clear();
      this.$router.push('/login')
    },
    goToEdit(){
      this.$router.push('/userEdit')
    },
    goToAdmin(){
      this.$router.push('/admin')
    }
  },
  mounted(){
    if(localStorage.getItem('isAdmin') === "true"){
      this.isAdmin = true;
    }
    // io.on(`user/${localStorage.getItem('user')}/new`, (e) => {
    //   this.newNotify = e;
    //   this.showAlert();
    // })
    io.on(`${localStorage.getItem('user')}`, (e) => {
      this.newNotify = e;
      this.showAlert();
    })
  }
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/navbar';

</style>