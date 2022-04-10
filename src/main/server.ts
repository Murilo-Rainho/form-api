import { app as server } from './config';

server.listen(4001, () => {
  console.log('server listen at port 4001');
});
