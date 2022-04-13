import { app as server, env } from './config';

import { mongoHelper } from '../infra/database/mongodb/helper';

mongoHelper.connect(env.mongoUrl)
  .then(() => {
    server.listen(env.port, () => {
      console.log(`server listen at port ${env.port}`);
    });
  })
  .catch((error) => console.log(error.message));
