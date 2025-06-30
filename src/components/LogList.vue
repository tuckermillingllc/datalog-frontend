<template>
  <f7-page>
    <f7-navbar title="Logs (Debug)" />
    <f7-block>
      <p>Check the browser console (F12) for API response.</p>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  mounted() {
    fetch('http://localhost:8000/api/logs')
      .then(res => res.json())
      .then(data => console.log('Fetched logs:', data))
      .catch(err => console.error('Fetch failed:', err));
  }
};
</script>
