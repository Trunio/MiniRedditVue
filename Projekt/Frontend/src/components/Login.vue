<template>
  <div v-if="invalidCredentials" class="alert alert-danger" role="alert">
    Invalid credentials!
  </div>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__container--left">
        <h1>Login</h1>
        <p>Enter Credentials</p>
        <input type="text" v-model='nickname' placeholder="Nickname">
        <input type="password" v-model='password' placeholder="Password">
        <button class="hero__container--btn" @click="Login"><a href="#">Login</a></button>
      </div>
      <span @click="goToRegister"> register </span>
      <span @click="goToRemind"> remind </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Login",
  data: function(){
    return{
      nickname: '',
      password: '',
      invalidCredentials: false,
    }
  },
  methods:{
    goToRegister(){
      this.$router.push('/register')
    },
    goToRemind(){
      this.$router.push('/remind')
    },
    showAlert() {
      this.invalidCredentials = true;
      setTimeout(() => this.invalidCredentials = false, 2000);
    },
    Login() {
      axios
          .post('http://localhost:3000/auth/login',{nickname: this.nickname, password: this.password})
          .then((res) => {
            localStorage.setItem('user-token', res.data.token);
            localStorage.setItem('user', res.data.user.id);
            if(res.data.user.role){
              localStorage.setItem('isAdmin', "true");
            }
            this.$router.push('/')
          })
          .catch(() => this.showAlert())
    }
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
    span{
      color: $blue;
      cursor: pointer;
      padding-left: 10px;
    }
    &--left {
      width: 100%;
      line-height: 1.2;
      @include tablet {
        padding: 5rem 0;
      }
      @include mobile {
        line-height: 1.5;
      }
    }

    &--left h1 {
      font-size: 4rem;
      color: $lime;

      @include mobile {
        font-size: 1.5rem;
      }
    }

    &--left p {
      font-size: 2rem;
      color: $dark;
      margin-top: 1rem;
      font-weight: 700;
      @include mobile {
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