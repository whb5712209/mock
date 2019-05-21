<template>
  <div>list</div>
</template>

<script>
  import axios from "axios";

  export default {
    components: {},
    mounted() {
      console.log(axios("/local/api/list"));
      // axios.$get("/local/api/list");
    }
  };
</script>

<style>
  .link {
    color: inherit;
    text-decoration: none;
  }
</style>
