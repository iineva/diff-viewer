export function postMessage(data: any, parentOrign: string) {
  try {
    window.parent.postMessage(data, parentOrign);
  } catch (e) {
    // console.error(e);
  }
}
