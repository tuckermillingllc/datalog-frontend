<template>
  <f7-app :routes="routes">
    <f7-view main url="/"></f7-view>
  </f7-app>
</template>

<script>
import routes from './routes';

export default {
  name: 'App',
  data() {
    return {
      routes
    };
  }
};
</script>
