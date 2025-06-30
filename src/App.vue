<template>
  <f7-page class="safe-areas">
    <f7-navbar title="Logs" class="custom-navbar" />
    
    <!-- Logs List -->
    <f7-list v-if="logs.length > 0">
      <f7-list-item
        v-for="log in logs"
        :key="log.id"
        :title="log.message"
      />
    </f7-list>
    
    <!-- Empty state -->
    <f7-block v-else>
      <p>No logs yet.</p>
    </f7-block>
    
    <!-- Input Section -->
    <f7-block>
      <f7-list>
        <f7-list-input
          v-model:value="newLog"
          type="text"
          placeholder="Enter a log message"
          clear-button
        />
      </f7-list>
      <f7-button fill @click="submitLog" :disabled="!newLog.trim()">
        Submit Log
      </f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  name: 'LogsPage',
  data() {
    return {
      logs: [
        // Sample data for testing
        { id: 1, message: 'Application started' },
        { id: 2, message: 'User logged in' }
      ],
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
        if (res.ok) {
          this.logs = await res.json();
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        // Keep sample data if API fails
      }
    },
    async submitLog() {
      if (!this.newLog.trim()) return;
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: this.newLog.trim() })
        });
        
        if (res.ok) {
          const saved = await res.json();
          this.logs.push(saved);
          this.newLog = '';
        } else {
          console.error('Failed to submit log: HTTP', res.status);
        }
      } catch (err) {
        console.error('Failed to submit log:', err);
        // Fallback: add to local array with temporary ID
        this.logs.push({
          id: Date.now(),
          message: this.newLog.trim()
        });
        this.newLog = '';
      }
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  --f7-navbar-bg-color: #f5f5f5;
  --f7-navbar-text-color: #000;
  --f7-navbar-border-color: transparent;
}

.safe-areas {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
