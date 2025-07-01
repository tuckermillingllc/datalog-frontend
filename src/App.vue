<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
}

header {
  background-color: #42b883;
  color: white;
  padding: 16px 20px;  /* Reduced from 20px */
  text-align: center;
}

header h1 {
  font-size: 24px;  /* Slightly smaller for mobile */
  font-weight: 600;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;  /* Reduced from 20px */
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;  /* Reduced from 30px */
  border-bottom: 2px solid #e0e0e0;
}

.tabs button {
  padding: 8px 16px;  /* Reduced padding */
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  header {
    padding: 12px 16px;
  }
  
  header h1 {
    font-size: 20px;
  }
  
  .app-container {
    padding: 12px;
  }
  
  .tabs {
    margin-bottom: 16px;
  }
}
</style>