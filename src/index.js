const express = require('express');
require('./database/mongoose');
const router = require('./routers');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log('Server is up on port' + port);
});
