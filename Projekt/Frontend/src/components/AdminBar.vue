<template>
  <Navbar></Navbar>
  <div class="sortbar">
    <a  class="sortbar--links" @click="emit('users')">Users</a>
    <a  class="sortbar--links" @click="emit('bestSubs')">Best Subs</a>
    <a  class="sortbar--links" @click="emit('bestPosts')">Best Posts</a>
  </div>
  <AdminPanel v-if="selected === 'users'"></AdminPanel>
  <SubsStats v-if="selected === 'bestSubs'"></SubsStats>
  <PostStats v-if="selected === 'bestPosts'"></PostStats>
</template>

<script>
import Navbar from "./Navbar";
import SubsStats from "./SubsStats";
import AdminPanel from "./AdminPanel";
import PostStats from "./PostStats";
export default {
  name: "AdminBar",
  components: {PostStats, SubsStats, Navbar, AdminPanel},
  data: function(){
    return {
      selected: 'users'
    }
  },
  methods:{
    emit(e) {
      this.selected = e
    }
  },
}
</script>
<style lang="scss">
@import '../styles/colors';
@import '../styles/media-queries';
.sortbar {
  height: 5vh;
  width: 40%;
  background-color: white;
  margin: 2rem auto;
  box-shadow: 0 0 15px 4px $gray;
  border-color: $semiLight;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include tablet {
    width: 90%;
  }
  &--links {
    color: $dark;
    justify-content: center;
    text-decoration: none;
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    &:hover {
      color: $lime;
      transition: all 0.3s ease;
      cursor: pointer;
      text-align: center;
      vertical-align: middle;
    }
    @include tablet {
      font-size: 0.8rem;
      padding: 0 0.5rem;
    }
  }
}
</style>