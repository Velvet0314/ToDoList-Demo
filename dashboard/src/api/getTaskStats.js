const getTaskStats = async (tokenStore, axios) => {
  try {
    const token = tokenStore.token;
    console.log(token);
    const response = await axios.get("/task/statistics", {
      headers: {
        Authorization: token,
      },
    });
    if (!response.data.code) {
      console.log("获取数据成功:", response.data);
      return response.data;
    } else {
      console.error("获取数据失败:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("请求数据出错:", error);
    throw error;
  }
};
export default getTaskStats;
