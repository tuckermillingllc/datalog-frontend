<template>
  <LogList />
</template>

<script>
import LogList from './components/LogList.vue';
import routes from './routes';

export default {
  components: { LogList },
  data() {
    return {
      routes
    };
  }
};
</script>
