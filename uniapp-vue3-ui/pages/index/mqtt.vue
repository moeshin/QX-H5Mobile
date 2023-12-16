<template>
  <uni-section title="Websocket">
    <uni-group title="Connect" mode="card">
      <uni-forms-item>
        <uni-title title="Host" />
        <uni-easyinput v-model="mqttOptions.hostname" />
      </uni-forms-item>
      <uni-forms-item name="port">
        <uni-title title="Port" />
        <uni-easyinput v-model.number="mqttOptions.port" type="number" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Path" />
        <uni-easyinput v-model="mqttOptions.path" value="/mqtt" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Client ID" />
        <uni-easyinput v-model="mqttOptions.clientId" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Username" />
        <uni-easyinput v-model="mqttOptions.username" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Passwrod" />
        <uni-easyinput v-model="mqttOptions.password" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Keep Alive" />
        <uni-easyinput v-model="mqttOptions.keepalive" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="Clean Session" />
        <switch
          :checked="mqttOptions.clean"
          @change="(e: any) => {
						mqttOptions.clean = e.detail.value
					}"
        />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="SSL" />
        <switch
          @change="(e: any) => {
            if (e.detail.value) {
              mqttOptions.port = 8084;
              mqttOptions.protocol = wsProtocol + 's' as any;
            } else {
              mqttOptions.port = 8083;
              mqttOptions.protocol = wsProtocol;
            }
          }"
        />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="URL" />
        <text>{{ wsURL }}</text>
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="State" />
        <text
          :class="
            (() => {
              switch (connectionState) {
                case ConnectionState.Connected:
                  return 'uni-success';
                case ConnectionState.Connecting:
                case ConnectionState.Reconnecting:
                  return 'uni-warning';
                case ConnectionState.Offline:
                case ConnectionState.Disconnected:
                  return 'uni-error';
              }
            })()
          "
        >
          {{ connectionState }}
        </text>
      </uni-forms-item>
      <view class="uni-btn-v">
        <button
          type="primary"
          :disabled="connectionState != ConnectionState.Disconnected"
          @click="connect"
        >
          Connect
        </button>
        <button
          type="warn"
          :disabled="connectionState == ConnectionState.Disconnected"
          @click="disconnect"
        >
          Disconnect
        </button>
      </view>
    </uni-group>
    <uni-group title="Subscribe" mode="card">
      <uni-forms-item>
        <uni-title title="Topic" />
        <uni-easyinput v-model="subscribeForm.topic" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-title title="QoS" />
        <uni-data-select
          v-model="subscribeForm.qos"
          :localdata="qosSelect"
          :clear="false"
        />
      </uni-forms-item>
      <view class="uni-btn-v">
        <button
          type="primary"
          :disabled="connectionState == ConnectionState.Disconnected"
          @click="subscribe"
        >
          Subscribe
        </button>
      </view>
      <uni-table border>
        <uni-tr>
          <uni-th align="center">Topic</uni-th>
          <uni-th align="center">QoS</uni-th>
          <uni-th align="center">Time</uni-th>
          <uni-th align="center">Operation</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, topic) in subscribeList" :key="topic">
          <uni-td>{{ topic }}</uni-td>
          <uni-td>{{ item.qos }}</uni-td>
          <uni-td><uni-dateformat :date="item.time"></uni-dateformat></uni-td>
          <uni-td align="center">
            <uni-icons
              type="clear"
              color="#c0c4cc"
              size="24"
              @click="() => {
                unsubscribe(topic as string);
              }"
            />
          </uni-td>
        </uni-tr>
      </uni-table>
    </uni-group>
  </uni-section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue';
import mqtt from '@/utils/mqtt';

let wsProtocol: 'ws' | 'wx' = 'ws';
// #ifdef MP-WEIXIN
wsProtocol = 'wx';
// #endif

enum ConnectionState {
  Connecting = 'Connecting',
  Connected = 'Connected',
  Offline = 'Offline',
  Reconnecting = 'Reconnecting',
  Disconnected = 'Disconnected',
}
const connectionState = ref(ConnectionState.Disconnected);

const mqttOptions = reactive<mqtt.IClientOptions>({
  protocol: wsProtocol,
  hostname: 'jqrjq.cn',
  port: 8083,
  path: '/mqtt',

  clientId: 'mqttjs_' + Math.random().toString(16).substring(2, 12),
  username: '',
  password: '',
  keepalive: 60,
  clean: true,

  connectTimeout: 8000,
  reconnectPeriod: 2000,
});

const wsURL = computed(
  () =>
    `${mqttOptions.protocol}://` +
    `${mqttOptions.hostname}:${mqttOptions.port}${mqttOptions.path}`,
);

const qosSelect: {
  value: any;
  text: string;
}[] = Array.from({ length: 3 }, (_, i) => ({
  value: i,
  text: i.toString(),
}));

const subscribeForm = reactive({
  topic: 'testtopic/#',
  qos: 0,
});

const subscribeList = reactive<{
  [topic: string]: {
    qos: number;
    time: number;
  };
}>({});

const MAX_RECONNECT_TIMES = 5;
let reconnectTimes = 0;

let client: mqtt.MqttClient | undefined = undefined;

function connect() {
  connectionState.value = ConnectionState.Connecting;
  // Event: connect -> offline -> close -> reconnect -> connect -> disconnect -> end
  client = mqtt
    .connect(mqttOptions)
    .on('message', (topic, payload) => {
      // console.log('message', topic, payload, packet);
      console.log('message', topic, payload.toString());
    })
    .on('error', (e) => {
      console.log('error', e);
    })
    .on('connect', () => {
      connectionState.value = ConnectionState.Connected;
    })
    .on('offline', () => {
      connectionState.value = ConnectionState.Offline;
      reconnectTimes = 0;
    })
    .on('reconnect', () => {
      connectionState.value = ConnectionState.Reconnecting;
      if (++reconnectTimes >= MAX_RECONNECT_TIMES) {
        console.log('Max reconnections exceeded');
        disconnect();
      }
    })
    .on('end', () => {
      connectionState.value = ConnectionState.Disconnected;
    });
  console.log(client);
  for (const e of [
    'connect',
    'reconnect',
    'close',
    'disconnect',
    'offline',
    'end',
  ]) {
    client.on(e, () => console.log('client.on', e));
  }
}

function disconnect() {
  if (!client) {
    return;
  }
  client.end(true);
  console.log(client);
  // #ifdef MP-WEIXIN
  connectionState.value = ConnectionState.Disconnected;
  // #endif
}

function subscribe() {
  if (!client) {
    return;
  }
  client.subscribe(
    subscribeForm.topic,
    {
      qos: subscribeForm.qos as any,
    },
    (err, granted) => {
      if (err) {
        console.error(err);
      } else {
        for (const grant of granted) {
          subscribeList[grant.topic] = {
            qos: grant.qos,
            time: Date.now(),
          };
        }
      }
    },
  );
}

function unsubscribe(topic: string) {
  client?.unsubscribe(topic as string, undefined, (err) => {
    if (err) {
      console.error(err);
    } else {
      delete subscribeList[topic];
    }
  });
}

onUnmounted(() => {
  disconnect();
});
</script>
