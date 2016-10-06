export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const wxeConfig = {
  corpId: process.env.WXE_CORPID,
  secret: process.env.WXE_SECRET,
  angetId: process.env.WXE_AGENTID || 7,
};

export const redisConfig = {
  host: process.env.HOST_REDIS || 'localhost',
  port: process.env.PORT_REDIS || 6379,
};

export const consulConfig = {
  host: process.env.CONSUL_HOST || 'consul.ynu.edu.cn',
  port: parseInt(process.env.CONSUL_PORT || 80, 10),
  promisify: true,
};

export const interval = parseInt(process.env.LISTEN_INTERVAL || 60000, 10);

export const monitorNode = process.env.MONITOR_NODE_NAME || 'consul-1';

// 用于接收监控消息的微信企业号tag
export const supervisorTag = parseInt(process.env.SUPERVISOR_TAG || '1', 10);

// 每日报告发出的时间（整点）
export const hour = parseInt(process.env.DAILY_REPORT_HOUR || '8', 10);
