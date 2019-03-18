<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center>
        <h1 class="display-2" color="#27293d">Whoops, 404</h1>
        <p>The page you were looking for does not exist</p>
        <v-btn outline="" color="#344675" @click="goBack">
          Get me out of here!
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import router from "../router.js";
export default {
  name: "NotFound",
  methods: {
    goBack() {
      router.push("/");
    }
  }
};
</script>
