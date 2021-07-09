<template>
  <Navbar></Navbar>
  <div v-if="invalidCredentials" class="alert alert-danger" role="alert">
    {{ message }}
  </div>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__container--left">
        <h1>Edit Your Data</h1>
        <p>Enter Credentials</p>
        <input type="text" v-model='nickname' placeholder="Nickname">
        <input type="password" v-model='password' placeholder="Password">
        <input type="email" v-model='email' placeholder="Email">
        <span>{{error}}</span>
        <button class="hero__container--btn" @click="Edit"><a href="#">Edit</a></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axiosConfig";
import Navbar from "./Navbar";
export default {
  name: "UserEditForm",
  components: {Navbar},
  data: function(){
    return{
      nickname: '',
      password: '',
      email: '',
      invalidCredentials: false,
      error: '',
      message: ''
    }
  },
  methods:{
    validateValues(){
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      const emailRegex = /\S+@\S+\.\S+/;
      if(this.nickname === ''){
        this.error = 'Nickname is empty';
        return;
      }
      if(this.password === ''){
        this.error = 'Password is empty';
        return;
      }
      if(!passwordRegex.test(this.password)){
        this.error = 'Password must be min 8 letters and contain one letter and one number ';
        return;
      }
      if(!emailRegex.test(this.email)){
        this.error = 'Email is in incorrect format';
        return;
      }
      if(this.email === ''){
        this.error = 'Email is empty';
        return;
      }
      this.error = '';
    },
    showAlert() {
      this.invalidCredentials = true;
      setTimeout(() => this.invalidCredentials = false, 2000);
    },
    Edit() {
      this.validateValues();
      if (this.error === '') {
        axios
            .put('http://localhost:3000/users/edit', {
              nickname: this.nickname,
              password: this.password,
              email: this.email
            })
            .then(() => {
              localStorage.clear();
              this.$router.push('/login');
            })
            .catch((e) => {
              this.message = e.response.data.error
              this.showAlert()
            });
      }
    }
  },
  mounted(){
    axios
        .get(`http://localhost:3000/users/data`)
        .then(response =>{
          this.email = response.data[0].email;
          this.nickname = response.data[0].nickname;
        })
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

    &--left span {
      font-size: 1rem;
      color: $orangeRed;
      margin-top: 1rem;
      font-weight: 700;
      display: block;
      @include mobile {
        font-size: 0.5rem;
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