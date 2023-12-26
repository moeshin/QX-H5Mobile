export async function uniLoaddingPromise<T>(
  promise: Promise<T>,
  text: string = '加载中',
): Promise<T> {
  uni.showLoading({
    title: text,
  });
  return promise
    .catch((e) => {
      if (e instanceof Error) {
        uni.showToast({
          title: e.message,
          icon: 'none',
        });
      }
      return Promise.reject(e);
    })
    .finally(() => {
      uni.hideLoading();
      uni.stopPullDownRefresh();
    });
}
