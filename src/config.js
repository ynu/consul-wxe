// 微信企业号设置
export const wxeConfig = {
  corpId: process.env.WXE_CORPID,
  secret: process.env.WXE_SECRET,
  angetId: process.env.WXE_AGENTID || 7,
};

// redis服务器设置
export const redisConfig = {
  host: process.env.HOST_REDIS || 'localhost',
  port: process.env.PORT_REDIS || 6379,
};

// consul服务器设置
export const consulConfig = {
  host: process.env.CONSUL_HOST || 'consul.ynu.edu.cn',
  port: parseInt(process.env.CONSUL_PORT || 80, 10),
  promisify: true,
};

// 用于监控关键服务的consul节点名称
export const monitorNode = process.env.MONITOR_NODE_NAME || 'consul-1';

// 用于接收监控消息的微信企业号tag
export const supervisorTag = parseInt(process.env.SUPERVISOR_TAG || '23', 10);

// 状态推送所用的cron字符串
// 关于Cron语法：https://en.wikipedia.org/wiki/Cron
export const reportCron = process.env.REPORT_CRON || '00 * * * * *';

// 关键系统例行检查所用的cron字符串
export const checkCron = process.env.CHECK_CRON || '00 * * * * *';
