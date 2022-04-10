import express from 'express';

const app = express();

app.listen(4001, () => {
  console.log('server listen at port 4001');
});
