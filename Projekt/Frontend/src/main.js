import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import mitt from "mitt";
const emitter = mitt();
library.add(faPhone);
library.add(faPlusCircle);
library.add(faDoorOpen);
library.add(faThumbsDown);
library.add(faThumbsUp);
library.add(faEdit);
library.add(faArrowAltCircleRight);
const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.use(VueAxios, axios);
app.use(router);
app.config.globalProperties.emitter = emitter;
app.mount("#app");
