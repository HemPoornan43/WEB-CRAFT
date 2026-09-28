async function test() {
  const keys = ['AIzaSyDKPo3lyh1TvNSku7gw7jDDlYr1zo7tHQs', 'AIzaSyB-cPcIPE_o4mYfAz0ebn_mMRcfxq5PXT4'];
  const folderId = '178oRX8akrUp6eqASCOQ5FafWfJi2RM4t';
  for (const key of keys) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${key}&fields=files(id,name,mimeType)`;
      const res = await fetch(url);
      const data = await res.json();
      console.log('Key:', key.slice(0, 10), 'res:', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }
}
test();
