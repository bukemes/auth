import pino from 'pino';
import pretty from 'pino-pretty';
const logger = pino(pretty());
export default logger;

// import logger from 'pino';
// import dayjs from 'dayjs';

// const log = logger({
//     prettyPrint: true,
//     base:{
//         pid: false
//     },
//     timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
// });

// export default log;