<template>
	<view>
		<uni-forms>
			<uni-section title="Websocket">
				<uni-group title="Connect" mode="card">
					<uni-forms-item>
						<uni-title title="Host" />
						<uni-easyinput v-model="mqttOptions.hostname" />
					</uni-forms-item>
					<uni-forms-item name="port">
						<uni-title title="Port" />
						<uni-easyinput
							v-model.number="mqttOptions.port"
							type="number"
						/>
					</uni-forms-item>
					<uni-forms-item>
						<uni-title title="Path" />
						<uni-easyinput
							v-model="mqttOptions.path"
							value="/mqtt"
						/>
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
											return 'uni-primary';
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
							:disabled="
								connectionState != ConnectionState.Disconnected
							"
							@click="connect"
						>
							Connect
						</button>
						<button
							type="warn"
							:disabled="
								connectionState == ConnectionState.Disconnected
							"
							@click="disconnect"
						>
							Disconnect
						</button>
					</view>
				</uni-group>
			</uni-section>
		</uni-forms>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
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

	clientId: 'emqx_vue3_' + Math.random().toString(16).substring(2, 8),
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

const MAX_RECONNECT_TIMES = 5;
let reconnectTimes = 0;

let client: mqtt.MqttClient | undefined = undefined;

function connect() {
	connectionState.value = ConnectionState.Connecting;
	// Event: connect -> offline -> close -> reconnect -> connect -> disconnect -> end
	client = mqtt.connect(mqttOptions);
	// console.log(client);
	client.on('message', (topic, payload, packet) => {
		console.log('message', topic, payload, packet);
	});
	client.on('error', (e) => {
		console.log('error', e);
	});
	client.on('connect', () => {
		connectionState.value = ConnectionState.Connected;
	});
	client.on('offline', () => {
		connectionState.value = ConnectionState.Offline;
		reconnectTimes = 0;
	});
	client.on('reconnect', () => {
		connectionState.value = ConnectionState.Reconnecting;
		if (++reconnectTimes >= MAX_RECONNECT_TIMES) {
			console.log(`Max reconnections exceeded`);
			disconnect();
		}
	});
	client.on('end', () => {
		connectionState.value = ConnectionState.Disconnected;
	});
	// for (const e of [
	//   'connect',
	//   'reconnect',
	//   'close',
	//   'disconnect',
	//   'offline',
	//   'end',
	// ]) {
	//   client.on(e, () => console.log('client.on', e));
	// }
}

function disconnect() {
	client?.end(true);
}
</script>
