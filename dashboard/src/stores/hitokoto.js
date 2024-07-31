import { defineStore } from 'pinia';
import axios from 'axios';

export const useHitokotoStore = defineStore('hitokoto', {
  state: () => ({
    text: '',
    from: '',
    url: '#',
  }),
  actions: {
    fetchData() {
      axios.get("https://v1.hitokoto.cn")
        .then(({ data }) => {
          this.text = data.hitokoto;
          this.from = data.from;
          this.url = `https://hitokoto.cn/?uuid=${data.uuid}`;
        })
        .catch((error) => {
          console.error(error);
          this.text = "加载失败";
          this.from = "";
          this.url = "#";
        });
    }
  }
});
