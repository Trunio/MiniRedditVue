<template>
  <Navbar></Navbar>
  <div v-if="invalidCredentials" class="alert alert-danger" role="alert">
    {{ error }}
  </div>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__container--left">
        <p v-if="!isEdit">Create Subreddit</p>
        <p v-if="isEdit"> Edit Subreddit </p>
        <input type="text" v-model='name' placeholder="Name">
        <textarea v-model='description' placeholder="Write description here"></textarea>
        <button class="hero__container--btn" @click="Create"><a href="#">Send</a></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axiosConfig";
import Navbar from "./Navbar";
export default {
  name: "SubredditForm",
  components: {Navbar},
  data: function(){
    return{
      name: '',
      description: '',
      link: '',
      isEdit: false,
      error: '',
      invalidCredentials: false
    }
  },
  methods:{
    showAlert(e) {
      this.error = e
      this.invalidCredentials = true;
      setTimeout(() => this.invalidCredentials = false, 2000);
    },
    Create() {
      if(this.name === ''){
        this.showAlert('Name is empty')
        return;
      }
      if(this.isEdit){
        axios
            .put(`http://localhost:3000/subreddit/${this.$route.params.name}`, {name: this.name, description: this.description, oldname: this.$route.params.name})
            .then(() => {
              this.$router.push('/subreddit/' + this.name)
            })
            .catch(() => this.showAlert('Subreddit with this name exists'))
      }else {
        axios
            .post('http://localhost:3000/subreddit/create', {name: this.name, description: this.description})
            .then(() => {
              this.$router.push('/subreddit/' + this.name)
            })
            .catch(() => this.showAlert('Subreddit with this name exists'))
      }
    }
  },
  mounted () {
    if(this.$route.name === 'SubredditFormEdit'){
      this.isEdit = true;
      axios
          .get(`http://localhost:3000/subreddit/${this.$route.params.name}`)
          .then((response) => {
            this.name = response.data[0].name;
            this.description = response.data[0].description;
          })
          .catch(() => this.showAlert())
    }
  },
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
    -webkit-box-shadow: 3px 3px 5px 6px $lightlime;
    -moz-box-shadow:    3px 3px 5px 6px $lightlime;
    box-shadow:         3px 3px 5px 6px $lightlime;
    @include tablet {
      height: 100%;
      width: 80%;
    }
    &--left {
      width: 100%;
      line-height: 1.2;
      @include tablet {
        padding: 3rem 0;
      }
      @include mobile {
        line-height: 1.5;
      }
    }
    &--left textarea {
      resize: none;
    }
    &--left h1 {
      font-size: 4rem;
      color: $lime;

      @include mobile {
        font-size: 1.5rem;
      }
    }

    &--left p {
      font-size: 3rem;
      color: $lime;
      font-weight: 700;
      @include tablet {
        font-size: 1rem;
      }
    }

    &--left a {
      font-size: 1rem;
      color: $dark;
      margin-top: 1rem;
      font-weight: 700;
      display: block;
      @include mobile {
        font-size: 1rem;
      }
    }
    &--left input {
      font-size: 1rem;
      color: $dark;
      font-weight: 700;
      margin: 1rem auto auto auto;
      padding: 0.1rem;
      box-shadow:0 0 15px 4px $light;
      border-color: $light;
      border-radius: 0.5rem;
      display: block;
      @include mobile {
        font-size: 1rem;
      }
    }

    &--left textarea {
      font-size: 1rem;
      color: $dark;
      font-weight: 700;
      margin: 2rem auto 2rem auto;
      padding: 0.1rem;
      box-shadow:0 0 3px 1px $gray;
      border-color: $gray;
      border-radius: 0.3rem;
      display: block;
      width: 80%;
      height: 30vh;
      @include mobile {
        font-size: 1rem;
      }
    }

    &--btn {
      font-size: 1rem;
      background-color: $lime;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      color: $light;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
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
}
</style>