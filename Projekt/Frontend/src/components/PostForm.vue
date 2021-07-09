<template>
  <Navbar></Navbar>
  <div v-if="invalidCredentials" class="alert alert-danger" role="alert">
    {{ error }}
  </div>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__container--left">
        <p>Create Post</p>
        <input type="text" v-model='name' placeholder="Title">
          <div class="hero__container--wrapper">
            <a href="#" class="hero__container--links" @click="selectedValue('Content')">Content</a>
            <a href="#" class="hero__container--links" @click="selectedValue('Media')">Media</a>
          </div>
        <div class="hero__container--data">
         <textarea v-model='description' placeholder="Write content here" v-if="select === 'Content'"></textarea>
          <div v-if="select === 'Media'" >
            <div @drop="drop" class="hero__container--data--drop" >
              <input type="file" multiple name="fields[assetsFieldHandle][]" id="assetsFieldHandle" @change="onChange" ref="file" accept=".pdf,.jpg,.jpeg,.png" />
              <label for="assetsFieldHandle" class="block cursor-pointer">
                  Drop a file or click here to upload
              </label>
            </div>
            <input type="text" v-model='vid' placeholder="Youtube Link">
            <iframe  :src= vid v-if="vid">
            </iframe>
            <input type="text" v-model='survey_name' placeholder="Ask a question">
            <div v-for="(item, index) in questions" :key="item" class="wrap">
              <input type="text" placeholder="Write answer" v-model="item.value">
              <button @click="deleteQuestion(index)" class="wrap--btn">
                delete
              </button>
            </div>
            <button @click="addQuestion" class="hero__container--btn">
              <font-awesome-icon icon="plus-circle" />
            </button>
          </div>
        </div>
        <button class="hero__container--btn" @click="Create"><a>Create</a></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axiosConfig";
import Navbar from "./Navbar";
export default {
  name: "PostForm",
  components: {Navbar},
  delimiters: ['${', '}'],
  data: function(){
    return{
      filelist: [],
      name: '',
      description: '',
      select: 'Content',
      vid: '',
      survey_name:'',
      questions: [],
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
    addQuestion: function () {
      this.questions.push({ value: '' });
    },
    deleteQuestion: function (index) {
      this.questions.splice(index, 1);
    },
    selectedValue(value){
      this.select = value
    },
    Create() {
      if(this.name === ''){
        this.showAlert('Title is empty')
        return
      }
      const formData = new FormData();
      let file = null;
      if(this.$refs.file)
        file = this.$refs.file.files[0];
        formData.append('file', file);
      formData.append('title', this.name);
      formData.append('content', this.description);
      formData.append('video', this.vid);
      if(this.survey_name !== ''){
        formData.append('survey_name', this.survey_name)
        let counter = 0
        this.questions.forEach((element) => {
          if(element.value !== "") {
            formData.append('survey_ans' + counter, element.value)
            counter ++
          }
        });
        formData.append('survey_len', String(counter))
      }
      axios
          .post(`http://localhost:3000/subreddit/${this.$route.params.name}/newPost`,formData)
          .then(() => {
            console.log('ok')
            this.$router.push(`/subreddit/${this.$route.params.name}`)
          })
          .catch(() => console.log('nieok'))
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
  watch: {
    vid: function () {
      if(this.vid.startsWith("https://www.youtube.com/"))
        this.vid = this.vid.replace('watch?v=', 'embed/')
      else
        this.vid = '';
    },
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
  margin-bottom: 10px;
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
      width:90%;
    }
    &--wrapper{
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding-left: 5rem;
      padding-right: 5rem;
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
      @include tablet {
        padding: 3rem 0;
      }
      @include mobile {
        line-height: 1.5;
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
      width: 80%;
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
    &--data {
      max-width: 80%;
      margin: auto;
      .wrap{
        display: flex;
        input{
          flex: 1;
        }
        &--btn {
          font-size: 1rem;
          background-color: $lime;
          border: none;
          border-radius: 4px;
          color: $light;
          cursor: pointer;
          margin-top: 0.8rem;
          position: relative;
          transition: all 0.3s;
          outline: none;
          align-content: end;
        }
      }
      &--drop{
        width: 100%;
        height: 100%;
        box-shadow:0 0 3px 1px $gray;
        border-color: $gray;
        border-radius: 0.3rem;
      }
      iframe{
        padding-top: 0.5rem;
        width: 100%;
        height: 100%;
      }
      textarea {
        font-size: 1rem;
        color: $dark;
        font-weight: 700;
        margin: 2rem auto 2rem auto;
        padding: 0.1rem;
        box-shadow:0 0 3px 1px $gray;
        border-color: $gray;
        border-radius: 0.3rem;
        display: block;
        width: 100%;
        height: 20vh;
        resize: none;
        @include mobile {
          font-size: 1rem;
        }
      }
    }

    &--btn {
      font-size: 1rem;
      background-color: $lime;
      margin-left: 1rem;
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