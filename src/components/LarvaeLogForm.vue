<template>
  <div class="larvae-log-form">
    <h2>Create New Larvae Log</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- User Info -->
      <div class="form-group">
        <label for="username">Username *</label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          required
          placeholder="Enter your name"
        />
      </div>

      <!-- Basic Info -->
      <div class="form-row">
        <div class="form-group">
          <label for="days_of_age">Days of Age *</label>
          <input
            id="days_of_age"
            v-model.number="formData.days_of_age"
            type="number"
            required
            min="0"
            placeholder="e.g., 7"
          />
        </div>

        <div class="form-group">
          <label for="row_number">Row Number</label>
          <input
            id="row_number"
            v-model="formData.row_number"
            type="text"
            placeholder="e.g., A1"
          />
        </div>
      </div>

      <!-- Larvae Measurements -->
      <div class="form-row">
        <div class="form-group">
          <label for="larva_weight">Larva Weight (mg) *</label>
          <input
            id="larva_weight"
            v-model.number="formData.larva_weight"
            type="number"
            required
            min="1"
            placeholder="e.g., 78"
          />
        </div>

        <div class="form-group">
          <label for="larva_pct">Larva Percentage (%) *</label>
          <input
            id="larva_pct"
            v-model.number="formData.larva_pct"
            type="number"
            required
            min="0"
            max="100"
            placeholder="e.g., 98"
          />
        </div>

        <div class="form-group">
          <label for="lb_larvae">Pounds of Larvae *</label>
          <input
            id="lb_larvae"
            v-model.number="formData.lb_larvae"
            type="number"
            required
            min="0"
            placeholder="e.g., 5"
          />
        </div>
      </div>

      <!-- Feed and Water -->
      <div class="form-row">
        <div class="form-group">
          <label for="lb_feed">Pounds of Feed *</label>
          <input
            id="lb_feed"
            v-model.number="formData.lb_feed"
            type="number"
            step="0.1"
            required
            min="0"
            placeholder="e.g., 20.0"
          />
        </div>

        <div class="form-group">
          <label for="lb_water">Pounds of Water *</label>
          <input
            id="lb_water"
            v-model.number="formData.lb_water"
            type="number"
            step="0.1"
            required
            min="0"
            placeholder="e.g., 34.0"
          />
        </div>
      </div>

      <!-- Additional Options -->
      <div class="form-group">
        <label>
          <input
            v-model="formData.screen_refeed"
            type="checkbox"
          />
          Screen Refeed
        </label>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="3"
          placeholder="Any additional notes..."
        ></textarea>
      </div>

      <!-- Calculated Values Preview -->
      <div v-if="calculatedValues" class="calculated-preview">
        <h3>Calculated Values:</h3>
        <div class="calculated-grid">
          <div>
            <strong>Larvae Count:</strong>
            <span>{{ calculatedValues.larvae_count.toLocaleString() }}</span>
          </div>
          <div>
            <strong>Feed per Larvae:</strong>
            <span>{{ calculatedValues.feed_per_larvae }} mg</span>
          </div>
          <div>
            <strong>Water:Feed Ratio:</strong>
            <span>{{ calculatedValues.water_feed_ratio }}:1</span>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Saving...' : 'Save Log' }}
        </button>
        <button type="button" @click="resetForm" class="btn-secondary">
          Reset
        </button>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useLarvaeLogStore } from '../stores/larvaeLog'

const store = useLarvaeLogStore()

// Form data
const formData = ref({
  username: '',
  days_of_age: null,
  larva_weight: null,
  larva_pct: null,
  lb_larvae: null,
  lb_feed: null,
  lb_water: null,
  screen_refeed: false,
  row_number: '',
  notes: ''
})

// Computed properties
const loading = computed(() => store.loading)
const error = computed(() => store.error)

// Calculate values in real-time
const calculatedValues = computed(() => {
  const { larva_weight, larva_pct, lb_larvae, lb_feed, lb_water } = formData.value
  
  if (!larva_weight || !larva_pct || !lb_larvae || !lb_feed || !lb_water) {
    return null
  }
  
  const larvae_count = Math.floor(((lb_larvae * (larva_pct / 100)) * 453592) / larva_weight)
  const feed_per_larvae = larvae_count > 0 ? 
    parseFloat(((lb_feed * 453592) / larvae_count).toFixed(1)) : 0
  const water_feed_ratio = lb_feed > 0 ? 
    parseFloat((lb_water / lb_feed).toFixed(1)) : 0
  
  return {
    larvae_count,
    feed_per_larvae,
    water_feed_ratio
  }
})

// Methods
async function handleSubmit() {
  try {
    await store.createLog(formData.value)
    resetForm()
    // You could emit an event or navigate to the logs view
    alert('Log created successfully!')
  } catch (err) {
    // Error is handled by the store
    console.error('Failed to create log:', err)
  }
}

function resetForm() {
  formData.value = {
    username: formData.value.username, // Keep username
    days_of_age: null,
    larva_weight: null,
    larva_pct: null,
    lb_larvae: null,
    lb_feed: null,
    lb_water: null,
    screen_refeed: false,
    row_number: '',
    notes: ''
  }
  store.clearError()
}

// Clear error when form data changes
watch(formData, () => {
  if (error.value) {
    store.clearError()
  }
}, { deep: true })
</script>

<style scoped>
.larvae-log-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px 14px;  /* Increased padding for better touch targets */
  border: 1px solid #ddd;
  border-radius: 6px;  /* Slightly more rounded */
  font-size: 16px;  /* Increased to prevent zoom on mobile */
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus {
  outline: none;
  border-color: #42b883;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

input[type="checkbox"] {
  margin-right: 8px;
}

textarea {
  resize: vertical;
}

.calculated-preview {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 6px;
  margin: 16px 0;  /* Reduced margins */
  border: 1px solid #e0e0e0;
}

.calculated-preview h3 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 16px;
  font-weight: 600;
}

.calculated-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.calculated-grid strong {
  display: block;
  color: #666;
  font-size: 12px;
}

.calculated-grid span {
  font-size: 18px;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;  /* Reduced from 30px */
}

/* Add responsive design for mobile */
@media (max-width: 640px) {
  .larvae-log-form {
    padding: 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  .calculated-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  input[type="text"],
  input[type="number"],
  textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #42b883;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #666;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>