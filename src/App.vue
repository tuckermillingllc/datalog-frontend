<template>
  <f7-page class="safe-areas">
    <f7-navbar title="Logs" class="custom-navbar" />
    <f7-list v-if="logs.length">
      <f7-list-item
        v-for="log in logs"
        :key="log.id"
        :title="log.message"
      />
    </f7-list>
    <f7-block>
      <f7-input v-model="newLog" placeholder="Enter a log message" />
      <f7-button fill @click="submitLog">Submit</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      logs: [],
      newLog: ''
    };
  },
  async mounted() {
    await this.fetchLogs();
  },
  methods: {
    async fetchLogs() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`);
        this.logs = await res.json();
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    },
    async submitLog() {
      if (!this.newLog.trim()) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: this.newLog })
        });

        const saved = await res.json();
        this.logs.push(saved);
        this.newLog = '';
      } catch (err) {
        console.error('Failed to submit log:', err);
      }
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: #f5f5f5 !important;
  color: #000 !important;
  box-shadow: none !important;
  padding-top: env(safe-area-inset-top); /* additional padding if needed */
}

</style>
