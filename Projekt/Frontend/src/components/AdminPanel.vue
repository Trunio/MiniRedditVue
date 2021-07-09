<template>
  <table class="table hero__container">
    <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">Nickname</th>
      <th scope="col">Email</th>
      <th scope="col"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in users" :key="item">
      <th scope="row">{{item.id}}</th>
      <td>{{item.nickname}}</td>
      <td>{{item.email}}</td>
      <td> <button class="hero__btn" @click="Delete(item.id)" v-if="item.nickname !== 'deleted user'">Ban</button></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "../axiosConfig"
export default {
  name: "AdminPanel",
  data: function(){
    return {
      users: [],
    }
  },
  methods:{
    Delete(id) {
      axios
          .put(`http://localhost:3000/users/ban/${id}`)
          .then(() => {
            this.$router.go();
          })
          .catch(() => console.log('nieok'))
    },
  },
  mounted(){
    axios
        .get(`http://localhost:3000/users/all`)
        .then(response =>{
          this.users = response.data
        })
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/media-queries';
@import '../styles/positions';
.hero {
  &__container {
    height: auto;
    width: 40%;
    margin: 3rem auto;
    background-color: $semiLight;
    border-radius: 5px;
    -webkit-box-shadow: 3px 3px 5px 6px $light;
    -moz-box-shadow:    3px 3px 5px 6px $light;
    box-shadow:         3px 3px 5px 6px $light;
    overflow-x: auto;
    white-space: nowrap;
    @include tablet {
      overflow-x:scroll;
      white-space: nowrap;
      th{
        font-size: 0.35rem;
      }
      tr{
        font-size: 0.35rem;
      }
    }
    span{
      font-weight: 700;
    }
  }
  &__btn {
    font-size: 0.6rem;
    background-color: $lime;
    border: none;
    border-radius: 4px;
    color: $light;
    cursor: pointer;
    transition: all 0.3s;
    outline: none;
  }
}
</style>