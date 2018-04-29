const express = require('express')
const app = express()

const api = require('./routes');

app.get('/', (req, res) => res.send('Gothic City API'))
app.use('/api', api)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
