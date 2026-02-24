const express = require('express');
const app = express();
const valuationConfig = require('./config/valuation.json');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/estimate', (req, res) => {
  res.json({
    message: 'Valuation loaded successfully',
    config: valuationConfig
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));