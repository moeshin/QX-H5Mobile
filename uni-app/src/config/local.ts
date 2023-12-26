interface WxConfig {
  jscode2session: string;
  appid: string;
  secret: string;
}

interface LocalConfig {
  wx: WxConfig;
}

export let localConfig: LocalConfig = undefined!!;

export function defienConfig(config: LocalConfig) {
  localConfig = config;
}
