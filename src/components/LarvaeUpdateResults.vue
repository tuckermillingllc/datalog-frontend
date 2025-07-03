<template>
  <div class="update-results">
    <h2>Update Post-Feed Condition</h2>

    <form @submit.prevent="submitUpdate">
      <div class="form-group">
        <label for="logId">Select Log ID</label>
        <select v-model="logId" required>
          <option disabled value="">Select...</option>
          <option v-for="log in logs" :key="log.id" :value="log.id">{{ log.id }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="postFeedCondition">Post-Feed Condition</label>
        <select v-model="postFeedCondition" required>
          <option disabled value="">Select condition...</option>
          <option>No Feed/Dry Frass</option>
          <option>No Feed/Wet Frass</option>
          <option>Feed Left/Dry Frass</option>
          <option>Feed Left/Wet Frass</option>
        </select>
      </div>

      <button type="submit" class="btn-primary">Update</button>
    </form>

    <p v-if="message" class="success-msg">{{ message }}</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const logId = ref('')
const postFeedCondition = ref('')
const logs = ref([])
const message = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`)
    logs.value = await res.json()
  } catch (e) {
    error.value = 'Failed to load logs.'
  }
})

async function submitUpdate() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs/${logId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_feed_condition: postFeedCondition.value })
    })

    if (!res.ok) throw new Error(await res.text())
    message.value = 'Update successful!'
    error.value = ''
  } catch (err) {
    error.value = 'Error updating log: ' + err.message
    message.value = ''
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.btn-primary {
  background-color: #42b883;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.success-msg {
  color: green;
  margin-top: 10px;
}

.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
