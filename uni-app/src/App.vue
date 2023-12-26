<script setup lang="ts">
import '@/local.config';
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
.app-title {
  padding: 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: $uni-main-color;
}
</style>
