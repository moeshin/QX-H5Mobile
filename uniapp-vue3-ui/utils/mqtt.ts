let mqtt;

// #ifdef H5
import { default as mqtt1 } from 'mqtt';
mqtt = mqtt1;
// #endif

// #ifdef MP-WEIXIN
import mqtt2 from 'mqtt/dist/mqtt';
mqtt = mqtt2;
// #endif

export default mqtt;
