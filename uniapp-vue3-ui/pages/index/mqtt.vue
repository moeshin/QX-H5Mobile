<template>
  <uni-section title="Websocket">
    <uni-group title="Connect" mode="card">
      <uni-forms-item>
        <view class="app-title">Host</view>
        <uni-easyinput v-model="mqttOptions.hostname" />
      </uni-forms-item>
      <uni-forms-item name="port">
        <view class="app-title">Port</view>
        <uni-easyinput v-model.number="mqttOptions.port" type="number" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Path</view>
        <uni-easyinput v-model="mqttOptions.path" value="/mqtt" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Client ID</view>
        <uni-easyinput v-model="mqttOptions.clientId" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Username</view>
        <uni-easyinput v-model="mqttOptions.username" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Passwrod</view>
        <uni-easyinput v-model="mqttOptions.password" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Keep Alive</view>
        <uni-easyinput v-model="mqttOptions.keepalive" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Clean Session</view>
        <switch
          :checked="mqttOptions.clean"
          @change="(e: any) => {
						mqttOptions.clean = e.detail.value
					}"
        />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">SSL</view>
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
        <view class="app-title">URL</view>
        <text>{{ wsURL }}</text>
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">State</view>
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
    </uni-group>
    <uni-group title="Subscribe" mode="card">
      <uni-forms-item>
        <view class="app-title">Topic</view>
        <uni-easyinput v-model="subscribeForm.topic" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">QoS</view>
        <uni-data-select
          v-model="subscribeForm.qos"
          :localdata="qosSelect"
          :clear="false"
        />
      </uni-forms-item>
      <button
        type="primary"
        :disabled="connectionState == ConnectionState.Disconnected"
        @click="subscribe"
      >
        Subscribe
      </button>
      <view class="app-title">Subscribe</view>
      <uni-table border>
        <uni-tr>
          <uni-th align="center">Topic</uni-th>
          <uni-th align="center">QoS</uni-th>
          <uni-th align="center">Time</uni-th>
          <uni-th align="center">Operation</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, topic) in subscribedTopics" :key="topic">
          <uni-td>{{ topic }}</uni-td>
          <uni-td align="center">{{ item.qos }}</uni-td>
          <uni-td align="center"><uni-dateformat :date="item.time" /></uni-td>
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
    <uni-group title="Message" mode="card">
      <uni-forms-item>
        <view class="app-title">Topic</view>
        <uni-easyinput v-model="messageForm.topic" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Message</view>
        <uni-easyinput v-model="messageForm.message" />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">QoS</view>
        <uni-data-select
          v-model="messageForm.qos"
          :localdata="qosSelect"
          :clear="false"
        />
      </uni-forms-item>
      <uni-forms-item>
        <view class="app-title">Retained</view>
        <switch
          :checked="messageForm.retain"
          @change="(e: any) => {
      			messageForm.retain = e.detail.value
      		}"
        />
      </uni-forms-item>
      <button
        type="primary"
        :disabled="connectionState == ConnectionState.Disconnected"
        @click="send"
      >
        Send
      </button>
      <GridLayout>
        <view class="app-title">Message already sent</view>
        <template #append>
          <uni-icons
            type="clear"
            color="#c0c4cc"
            size="24"
            @click="
              () => {
                sentMessages.splice(0);
              }
            "
          />
        </template>
      </GridLayout>
      <uni-table
        border
        :style="{
          marginButtom: 22,
        }"
      >
        <uni-tr>
          <uni-th align="center">Message</uni-th>
          <uni-th align="center">Topic</uni-th>
          <uni-th align="center">QoS</uni-th>
          <uni-th align="center">Time</uni-th>
        </uni-tr>
        <uni-tr v-for="message in sentMessages">
          <uni-td>{{ message.message }}</uni-td>
          <uni-td>{{ message.topic }}</uni-td>
          <uni-td align="center">{{ message.qos }}</uni-td>
          <uni-td align="center">
            <uni-dateformat :date="message.time" />
          </uni-td>
        </uni-tr>
      </uni-table>
      <GridLayout>
        <view class="app-title">Message received</view>
        <template #append>
          <uni-icons
            type="clear"
            color="#c0c4cc"
            size="24"
            @click="
              () => {
                receivedMessages.splice(0);
              }
            "
          />
        </template>
      </GridLayout>
      <uni-table
        border
        :style="{
          marginButtom: 22,
        }"
      >
        <uni-tr>
          <uni-th align="center">Message</uni-th>
          <uni-th align="center">Topic</uni-th>
          <uni-th align="center">QoS</uni-th>
          <uni-th align="center">Time</uni-th>
        </uni-tr>
        <uni-tr v-for="message in receivedMessages">
          <uni-td>{{ message.message }}</uni-td>
          <uni-td>{{ message.topic }}</uni-td>
          <uni-td align="center">{{ message.qos }}</uni-td>
          <uni-td align="center">
            <uni-dateformat :date="message.time" />
          </uni-td>
        </uni-tr>
      </uni-table>
    </uni-group>
  </uni-section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue';
import mqtt from '@/utils/mqtt';
import GridLayout from '@/components/GridLayout.vue';

const { console } = window;

interface Message {
  message: string;
  topic: string;
  qos: number;
  time: number;
}

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
  value: mqtt.QoS;
  text: string;
}[] = Array.from({ length: 3 }, (_, i) => ({
  value: i as mqtt.QoS,
  text: i.toString(),
}));

const subscribeForm = reactive({
  topic: 'testtopic/#',
  qos: 0 as mqtt.QoS,
});

const subscribedTopics = reactive<{
  [topic: string]: {
    qos: number;
    time: number;
  };
}>({});

const messageForm = reactive({
  topic: 'testtopic',
  message: '{ "msg": "Hello, World!" }',
  qos: 0 as mqtt.QoS,
  retain: false,
});

const receivedMessages = reactive<Message[]>([]);
const sentMessages = reactive<Message[]>([]);

const MAX_RECONNECT_TIMES = 5;
let reconnectTimes = 0;

let client: mqtt.MqttClient | undefined = undefined;

function connect() {
  connectionState.value = ConnectionState.Connecting;
  // Event: connect -> offline -> close -> reconnect -> connect -> disconnect -> end
  client = mqtt
    .connect(mqttOptions)
    .on('message', (topic, payload, packet) => {
      const { qos } = packet as mqtt.IPublishPacket;
      receivedMessages.push({
        message: payload.toString(),
        topic,
        qos,
        time: Date.now(),
      });
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
      qos: subscribeForm.qos,
    },
    (err, granted) => {
      if (err) {
        console.error(err);
      } else {
        for (const grant of granted) {
          subscribedTopics[grant.topic] = {
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
      delete subscribedTopics[topic];
    }
  });
}

function send() {
  const { topic, message, qos, retain } = messageForm;
  client?.publish(
    topic,
    message,
    {
      qos,
      retain,
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        sentMessages.push({
          message,
          topic,
          qos,
          time: Date.now(),
        });
      }
    },
  );
}

onUnmounted(() => {
  disconnect();
});
</script>
<style lang="scss" scoped>
::v-deep .uni-group__content {
  > button,
  > uni-button,
  > .uni-table-scroll {
    margin-bottom: 22px;
  }
}
</style>
