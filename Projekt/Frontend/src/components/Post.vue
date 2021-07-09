<template>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__container--left">
        <div class="hero__container--wrapper">
          <span class="hero__container--wrapper--leftside"><a :href="'http://localhost:8080/subreddit/' + subreddit">r/{{subreddit}}</a></span>
          <span class="hero__container--wrapper--rightside">{{user}}</span>
        </div>
        <p> {{ title }} </p>
        <div class="hero__container--data">
          <span>  <div v-html="urlify(content)" ></div></span>
          <img v-if="image_path" class="image" :src="image_path" alt="image"/>
          <iframe :src= vid v-if="vid">
          </iframe>
          <div class="hero__container--data--title" v-if="question">
            {{ question }}
          </div>
          <div v-for="item in answers" :key="item">
            <div  class="hero__container--data--ans">
              <input type="checkbox" v-model="additional_grouped" :value="item.id" @change="uniqueCheck">
              <label> {{ item.answer }} </label>
            </div>
            <div v-if="item.users[0]" class="hero__container--data--vote"> {{ survAnswer(item) }} </div>
          </div>
        </div>
      </div>
      <div class="hero__container--bottom">
        <button class="hero__container--btn " @click="newVote('upVote')" v-bind:class="{ upvoted: isUpvoted }"><a>
          <font-awesome-icon icon="thumbs-up" />
        </a></button>
        {{sumVote}}
        <button class="hero__container--btn " @click="newVote('downVote')" v-bind:class="{ downovted: isDownvoted }"><a>
          <font-awesome-icon icon="thumbs-down" />
        </a></button>
        <button class="hero__container--btn " @click="goToComments"><a href="#">Comments</a></button>
        <button class="hero__container--btn " @click="Delete" v-if="String(user_id) === String(curr_user_id) || isMod"><a>Delete</a></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axiosConfig";
import io from '@/socketio'
export default {
  name: "Post",
  delimiters: ['${', '}'],
  props:{
    title: String,
    content: String,
    image_path: String,
    subreddit: String,
    user: String,
    id: String,
    vote: Number,
    vid: String,
    voteSum: Number,
    user_id: Number,
    question: String,
    answers: Array,
    surv_id: Number,
    isMod: Boolean,
  },
  data: function(){
    return{
      name: '',
      description: '',
      select: 'Content',
      isUpvoted: false,
      isDownvoted: false,
      curr_user_id: Number,
      additional_grouped: [],
      currentVote: '',
      Mod: false
    }
  },
  computed: {
    sumVote: function () {
      if(this.currentVote !== '')
        return this.currentVote
      return this.voteSum
    },
  },
  methods:{
    urlify(text) {
    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function(url,b,c) {
    let url2 = (c === 'www.') ?  'http://' +url : url;
    return '<a href="' +url2+ '">' + url + '</a>';
      })
    },
    survAnswer(item) {
      if(item.users.length === 1)
        return `${item.users[0].nickname} voted`
      if(item.users.length === 2)
        return `${item.users[0].nickname} and ${item.users.length -1} user voted`
      else
        return `${item.users[0].nickname} and ${item.users.length -1} users voted`
    },
    uniqueCheck(e) {
      this.additional_grouped = [];
      axios
          .post(`http://localhost:3000/posts/${this.id}/survey/${this.surv_id}?answer_id=${e.target.value}`)
      if (e.target.checked) {
        this.additional_grouped.push(e.target.value);
      }
    },
    Delete(){
      if (confirm('Are you sure you want to delete this post?')) {
        axios
            .delete(`http://localhost:3000/posts/${this.id}`)
            .then(() => {
              this.$router.push(`/`)
            })
      }
    },
    goToComments(){
      this.$router.push(`/post/${this.id}`)
    },
    selectedValue(value){
      this.select = value
    },
    newVote(value){
      axios
          .post(`http://localhost:3000/posts/${this.id}/vote?action=${value}`)
          .then((res) => {
            console.log(res.data)
            if(res.data.vote === 'upvote') {
              this.isUpvoted = true;
              this.isDownvoted = false;
            }
            if(res.data.vote === 'downvote') {
              this.isDownvoted = true;
              this.isUpvoted = false;
            }
            if(res.data.vote === 'none'){
              this.isDownvoted = false;
              this.isUpvoted = false;
            }
            this.currentVote = res.data.sum
          })
          .catch(() => console.log('error'))
    },
    onChange() {
      this.filelist = [...this.$refs.file.files];
    },
    remove(i) {
      this.filelist.splice(i, 1);
    },
    drop(event) {
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
    }
  },
  mounted() {
    io.on(`post/${this.id}/vote`, (e) => {
      console.log(this.currentVote)
      this.currentVote = e
    })

    if(this.answers) {
      this.answers.forEach(value => {
        if (value.voted === "1") {
          this.additional_grouped.push(value.id)
        }
      })
    }
    this.curr_user_id = localStorage.getItem('user')
    if( this.vote === 1) {
      this.isUpvoted = true;
      this.isDownvoted = false;
    }
    if(this.vote === -1) {
      this.isDownvoted = true;
      this.isUpvoted = false;
    }
    if(this.vote === 0){
      this.isDownvoted = false;
      this.isUpvoted = false;
    }
    // axios
    //     .get(`http://localhost:3000/subreddit/${this.subreddit}/checkMod`)
    //     .then(() => this.Mod = true )
    //     .catch(() => this.Mod = false)
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.alert{
  width: 30%;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
}
.upvoted{
  background-color: $blue !important;
}
.downovted{
  background-color: $orangeRed !important;
}
.hero {
  @extend %align-center;
  &__container {
    height: 100%;
    align-items: center;
    justify-items: center;
    margin: auto;
    width: 40%;
    max-width: 1200px;
    border-radius: 5px;
    margin-bottom: 5vh;
    -webkit-box-shadow: 3px 3px 5px 6px $gray;
    -moz-box-shadow:    3px 3px 5px 6px $gray;
    box-shadow:         3px 3px 5px 6px $gray;
    @include tablet {
      height: 100%;
      width:90%;
    }
    &--wrapper{
      display: flex;
      width: 100%;
      align-items: center;
      justify-items: center;
      justify-content: space-between;
      padding-top: 0.5rem;
        &--leftside{
          padding-left: 0.5rem;
          a {
            @include tablet {
              font-size: 0.5rem;
            }
          }
        }
        &--rightside{
          padding-right: 0.5rem;
          a {
            @include tablet {
              font-size: 0.5rem;
            }
          }
        }

    }
    &--bottom{
      display: flex;
      width: 100%;
      align-items: center;
      justify-items: center;
      height: 100%;
    }
    &--links {
      color: $dark;
      text-decoration: none;
      padding: 0 1rem;
      font-size: 1rem;
      &:hover {
        color: $lime;
        transition: all 0.3s ease;
      }
      @include tablet {
        font-size: 0.5rem;
        padding: 0 0.5rem;
      }
    }
    &--left {
      width: 100%;
      line-height: 1.2;
      display: flex;
      flex-direction: column;
      height: 100%;
      @include tablet {
      }
      @include mobile {
        line-height: 1.5;
      }
    }
    &--left p {
      font-size: 1.5rem;
      color: $dark;
      font-weight: 700;
      padding-top: 0.2rem;
      @include tablet {
        font-size: 1rem;
      }
    }

    &--data {
      width: 90%;
      margin: 1rem auto 1rem auto;
      padding-bottom: 1rem;
      box-shadow: 0 0 3px 1px $gray;
      border-color: $gray;
      border-radius: 0.3rem;
      align-items: center;
      margin-top: auto;
      &--vote {
        font-weight: 700;
        padding-left: 0.5rem;
        font-size: 0.7rem;
        text-align: left;
        margin-bottom: 0.5rem;
      }
      &--title{
        font-weight: 900;
      }
      &--ans{
        text-align: left;
        label{
          font-weight: 700;
          padding-left: 0.5rem;
        }
        input{
          margin-left: 1rem;
          float: left
        }
      }
      span{
        float: left;
        border-color: $gray;
        word-break: break-all;
        width: 100%;
        margin-bottom: 1rem;
        text-align: start;
        padding-left: 0.3rem;
        padding-top: 0.3rem;
      }
      iframe{
        padding-top: 0.5rem;
        width: 100%;
        height: 100%;
        min-height: 30vh;
      }
      img {
        padding-top: 0.5rem;
        max-width: 100%;
        max-height: 100%;
      }
    }

    &--btn {
      font-size: 1rem;
      background-color: $lime;
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
      background: gray;
      transition: all 0.3s;
      border-radius: 4px;
    }
    &--btn:hover:after {
      width: 100%;
    }
  }
}
</style>