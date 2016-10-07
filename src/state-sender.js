/*
 eslint-disable no-console, new-cap
*/

import Api from 'wxent-api-redis';
import Consul from 'consul';
import { wxeConfig, redisConfig, consulConfig,
  monitorNode, supervisorTag } from './config';

const consul = Consul(consulConfig);
const wxapi = Api(wxeConfig.corpId, wxeConfig.secret, wxeConfig.angetId,
  redisConfig.host, redisConfig.port);

export const check = async (state = 'critical') => {
  try {
    let result = await consul.health.state(state);
    if (monitorNode) {
      result = result.filter(item => item.Node === monitorNode);
    }

    if (!result.length) return;
    const content = result.reduce((text, item) => {
      const val = `----------\n服务名:${item.ServiceName}\n错误输出:${item.Output}`;
      return `${text}${val}`;
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

export const report = async () => {
  try {
    const result = await consul.health.state('any');

    const checkStat = result.reduce((stat, item) => {
      switch (item.Status) {
        case 'critical':
          return {
            ...stat,
            错误: stat.错误 + 1,
          };
        case 'passing':
          return {
            ...stat,
            正常: stat.正常 + 1,
          };
        case 'warning':
          return {
            ...stat,
            警告: stat.警告 + 1,
          };
        default:
          return {
            ...stat,
            其他: stat.其他 + 1,
          };
      }
    }, { 正常: 0, 警告: 0, 错误: 0, 其他: 0 });
    wxapi.send({
      totag: supervisorTag,
    }, {
      msgtype: 'text',
      text: {
        content: Object.entries(checkStat).reduce((stat, item) => (
            `${stat}\n${item[0]}: ${item[1]}`
          ), '【系统状态报告】\n---------'),
      },
      safe: 0,
    }, (err, res) => {
      console.log(err | res);
    });
  } catch (e) {
    console.log(e);
  }
};
