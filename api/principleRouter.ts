import { createRouter, publicQuery } from "./middleware";

const focuses = [
  {
    id: "nozzle",
    label: "喷嘴加速",
    title: "把压力能变成速度",
    description:
      "压缩空气从 P 口进入，经过截面积收窄的喷嘴后加速。喷嘴出口形成高速射流，周围静压随之降低。",
    note: "观察红色粒子：接近喉部时明显提速。",
  },
  {
    id: "entrain",
    label: "射流卷吸",
    title: "高速射流带走周围空气",
    description:
      "射流通过粘性剪切与动量交换卷吸接收室内的气体，使 V 口所连接的管路和吸盘腔体压力下降。",
    note: "观察蓝色粒子：从真空口被带入主射流。",
  },
  {
    id: "diffuser",
    label: "混合排出",
    title: "两股气流合流并排出",
    description:
      "压缩空气与被吸入的气体在混合室汇合，经扩散器减速扩压，最后由 R 口排向大气；消声器可降低排气噪声。",
    note: "观察右侧：红蓝粒子在扩散器中共同前进。",
  },
  {
    id: "hold",
    label: "真空吸持",
    title: "利用压差产生吸附力",
    description:
      "当吸盘贴住工件并形成相对密闭的腔体，持续抽走腔内气体即可建立负压。外界大气压与腔内压力之差形成吸持作用。",
    note: "观察下方工件：建立真空后被吸盘向上吸附。",
  },
] as const;

export const principleRouter = createRouter({
  focuses: publicQuery.query(() => focuses),
});
