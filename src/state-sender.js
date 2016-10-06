/*
 eslint-disable no-consule
*/

import Api from 'wxent-api-redis';
import Consul from 'consul';
import { wxeConfig, redisConfig, consulConfig,
  monitorNode, interval, supervisorTag, hour } from './config';

const consul = Consul(consulConfig);
const wxapi = Api(wxeConfig.corpId, wxeConfig.secret, wxeConfig.angetId,
  redisConfig.host, redisConfig.port);

const listenAndSend = async state => {
  try {
    let result = await consul.health.state(state);
    if (monitorNode) {
      result = result.filter(item => item.Node === monitorNode);
    }

    if (!result.length) return;
    const content = result.reduce((content, item) => {
      const val = `----------\n服务名:${item.ServiceName}\n错误输出:${item.Output}`;
      return `${content}${val}`;
    }, '【关键系统故障】\n');
    wxapi.send({
      totag: supervisorTag,
    }, {
      msgtype: 'text',
      text: {
        content,
      },
      safe: 0,
    }, (err, res) => {
      console.log(err | res);
    });
  } catch (e) {
    console.log(e);
  }
};

const dailyReport = async () => {
  try {
    const result = await consul.health.state('any');

    const checkStat = result.reduce((stat, item) => {
      switch (item.Status) {
        case 'critical':
          return {
            ...stat,
            critical: stat.critical + 1,
          };
        case 'passing':
          return {
            ...stat,
            passing: stat.passing + 1,
          };
        case 'warning':
          return {
            ...stat,
            warning: stat.warning + 1,
          };
        default:
          return {
            ...stat,
            other: stat.other + 1,
          };
      }
    }, { passing: 0, warning: 0, critical: 0, other: 0 });
    wxapi.send({
      totag: supervisorTag,
    }, {
      msgtype: 'text',
      text: {
        content: `【系统状态报告】\n正常:${checkStat.passing}\n警告:${checkStat.warning}\n报警:${checkStat.critical}\n其他:${checkStat.other}`,
      },
      safe: 0,
    }, (err, res) => {
      console.log(err | res);
    });
  } catch (e) {
    console.log(e);
  }
};

export const listen = (state) => {
  setInterval(() => (listenAndSend(state)), interval);
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === hour) {
      dailyReport();
    }
  }, 60000);
};
