import { Events } from 'vue';

export type EventLisenter = {
  [key in keyof Events]?: (e: Events[key]) => void;
};
