<template>
  <table class="table hero__container">
    <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">Name</th>
      <th scope="col">Posts</th>
      <th scope="col">Users</th>
      <th scope="col">Votes</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in subs" :key="item">
      <th scope="row">{{item.id}}</th>
      <td>{{item.name}}</td>
      <td>{{item.posts}}</td>
      <td>{{item.users}}</td>
      <td>{{item.votes}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>

import axios from "../axiosConfig";

export default {
  name: "SubsStats",
  data: function(){
    return {
      subs: [],
    }
  },
  methods:{
  },
  mounted(){
    axios
        .get(`http://localhost:3000/subreddit/stats/Subs`)
        .then(response =>{
          this.subs = response.data
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