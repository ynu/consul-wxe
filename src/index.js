/*
 eslint-disable no-console, no-new
*/

import 'babel-polyfill';
import { report, check } from './state-sender';
import { CronJob } from 'cron';
import { reportCron, checkCron } from './config';

// 关键系统的例行检查
try {
  new CronJob(checkCron, check.bind(null, 'critical'), null, true);
} catch (e) {
  console.log('CHECK CRON JOB ERROR:', e);
}

// 日常状态推送
try {
  new CronJob(reportCron, report, null, true);
} catch (e) {
  console.log('REPORT CRON JOB ERROR:', e);
}
