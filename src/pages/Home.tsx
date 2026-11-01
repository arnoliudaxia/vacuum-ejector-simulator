import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Wind,
} from "lucide-react";
import VacuumSimulator, { type FocusId } from "@/components/VacuumSimulator";
import "../App.css";

type FocusContent = {
  id: FocusId;
  label: string;
  title: string;
  description: string;
  note: string;
};

const fallbackFocuses: FocusContent[] = [
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
];

const structures = [
  {
    mark: "P",
    name: "供气口与喷嘴",
    text: "接入压缩空气，通过收缩喷嘴将压力能转化为射流动能。",
  },
  {
    mark: "V",
    name: "真空口与接收室",
    text: "连接真空管路或吸盘；高速射流卷吸这里的气体，形成低于大气压的压力。",
  },
  {
    mark: "R",
    name: "混合室与扩散器",
    text: "让驱动气流与被吸入气体汇合，并通过渐扩通道减速、排出。",
  },
  {
    mark: "F",
    name: "吸盘与工件",
    text: "吸盘内外形成压差，大气压力将工件压向吸盘，从而完成搬运吸持。",
  },
];

function VacuumGauge({ vacuum, running }: { vacuum: number; running: boolean }) {
  const angle = -72 + (vacuum / 90) * 144;
  return (
    <div className="gauge-block" aria-live="polite">
      <div className="readout-label">
        <Gauge aria-hidden="true" size={18} />
        真空口压力 · 示意
      </div>
      <svg className="gauge" viewBox="0 0 160 116" aria-hidden="true">
        <path d="M 26 80 A 54 54 0 0 1 134 80" className="gauge-track" />
        <path d="M 26 80 A 54 54 0 0 1 134 80" className="gauge-value" pathLength="100" strokeDasharray={`${(vacuum / 90) * 100} 100`} />
        {[0, 1, 2, 3, 4].map((tick) => {
          const tickAngle = -72 + tick * 36;
          return (
            <line
              key={tick}
              x1="80"
              y1="30"
              x2="80"
              y2="36"
              className="gauge-tick"
              transform={`rotate(${tickAngle} 80 80)`}
            />
          );
        })}
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="38"
          className="gauge-needle"
          transform={`rotate(${angle} 80 80)`}
        />
        <circle cx="80" cy="80" r="6" className="gauge-pin" />
        <text x="20" y="102" className="gauge-small">0</text>
        <text x="124" y="102" className="gauge-small">−90</text>
      </svg>
      <div className="gauge-number">
        {running ? `−${vacuum}` : "0"} <span>kPa</span>
      </div>
      <p>{running ? "真空已建立" : "等待压缩空气"}</p>
    </div>
  );
}

export default function Home() {
  const [running, setRunning] = useState(true);
  const [pressure, setPressure] = useState(0.5);
  const [focus, setFocus] = useState<FocusId>("nozzle");
  // GitHub Pages 是纯静态托管，没有后端 API；直接使用内置的演示说明数据。
  const focuses: FocusContent[] = fallbackFocuses;
  const active = focuses.find((item) => item.id === focus) ?? focuses[0];
  const vacuum = running ? Math.round(15 + pressure * 95) : 0;

  const reset = () => {
    setPressure(0.5);
    setRunning(true);
    setFocus("nozzle");
  };

  return (
    <div className="page-shell" id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="返回页面顶部">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M4 16h9c5 0 5-8 10-8h5M4 16h9c5 0 5 8 10 8h5" />
            <path d="M20 5l5 3-5 3M20 21l5 3-5 3" />
          </svg>
          <span>FLOW<span className="brand-divider">/</span>原理实验室</span>
        </a>
        <a className="header-link" href="#simulator">
          原理演示 <ArrowDown size={17} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-meta">气动元件 · 交互式剖面演示</p>
          <h1 id="hero-title">一口压缩空气，<br /><strong>造出真空。</strong></h1>
          <p className="hero-intro">
            没有电机，也没有活塞。真空发生器让压缩空气通过喷嘴形成高速射流，
            再利用引射效应抽走另一侧的气体。
          </p>
          <a className="primary-cta" href="#simulator">
            启动原理演示 <ArrowDown size={20} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-principle" aria-label="原理概要">
          <div className="principle-symbol">P<span>→</span>v↑<span>→</span>p↓</div>
          <p>压力能转化为动能，高速射流再卷吸周围气体。</p>
          <div className="hero-flow">
            <span><Wind size={20} aria-hidden="true" />压缩空气</span>
            <ArrowRight aria-hidden="true" />
            <span>高速射流</span>
            <ArrowRight aria-hidden="true" />
            <span>负压抽吸</span>
          </div>
        </div>
      </section>

      <main>
        <section className="simulator-section" id="simulator" aria-labelledby="simulator-title">
          <div className="section-heading">
            <div>
              <p className="section-index">LIVE CUTAWAY</p>
              <h2 id="simulator-title">看见负压的诞生</h2>
            </div>
            <p>
              蓝色虚线圈出当前观察区域。实际运行时，加速、卷吸与排气和吸持是连续同时发生的。
            </p>
          </div>

          <div className="simulator-layout">
            <div className="canvas-column">
              <VacuumSimulator running={running} pressure={pressure} focus={focus} />
              <div className="legend" aria-label="气流颜色图例">
                <span><i className="legend-dot supply" />压缩空气</span>
                <span><i className="legend-dot entrained" />被卷吸气体</span>
                <span><i className="legend-line" />低压区</span>
              </div>
            </div>

            <aside className="readout-panel" aria-label="实时演示读数">
              <VacuumGauge vacuum={vacuum} running={running} />
              <div className="supply-readout">
                <span>供气压力</span>
                <strong>{pressure.toFixed(2)} <small>MPa</small></strong>
              </div>
              <div className="flow-status">
                <span className={running ? "status-dot active" : "status-dot"} />
                <div>
                  <strong>{running ? "持续抽吸中" : "抽吸已停止"}</strong>
                  <p>{running ? "驱动气流与被吸入气体共同排出" : "恢复供气后重新建立真空"}</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="control-deck">
            <div className="transport-controls">
              <button
                className="play-button"
                type="button"
                onClick={() => setRunning((value) => !value)}
                aria-label={running ? "暂停供气" : "恢复供气"}
              >
                {running ? <Pause size={21} fill="currentColor" aria-hidden="true" /> : <Play size={21} fill="currentColor" aria-hidden="true" />}
                {running ? "暂停供气" : "恢复供气"}
              </button>
              <button className="reset-button" type="button" onClick={reset} aria-label="重置演示">
                <RotateCcw size={20} aria-hidden="true" />
                <span>重置</span>
              </button>
            </div>
            <div className="pressure-control">
              <label htmlFor="pressure">调节供气压力</label>
              <div className="range-row">
                <span>0.20</span>
                <input
                  id="pressure"
                  type="range"
                  min="0.2"
                  max="0.7"
                  step="0.05"
                  value={pressure}
                  onChange={(event) => setPressure(Number(event.target.value))}
                  aria-valuetext={`${pressure.toFixed(2)} 兆帕`}
                />
                <span>0.70 MPa</span>
              </div>
            </div>
          </div>

          <div className="focus-controls" aria-label="选择观察区域">
            {focuses.map((item) => (
              <button
                key={item.id}
                type="button"
                className={focus === item.id ? "focus-button selected" : "focus-button"}
                aria-pressed={focus === item.id}
                onClick={() => setFocus(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="focus-explanation" aria-live="polite">
            <div>
              <span className="focus-label">当前观察 · {active.label}</span>
              <h3>{active.title}</h3>
            </div>
            <div>
              <p>{active.description}</p>
              <strong>{active.note}</strong>
            </div>
          </div>
          <p className="simulation-note">动画与读数用于解释原理，不是流体仿真或设备选型数据。</p>
        </section>

        <section className="structure-section" id="structure" aria-labelledby="structure-title">
          <div className="section-heading compact">
            <div>
              <p className="section-index">ANATOMY</p>
              <h2 id="structure-title">四个区域，一条气路</h2>
            </div>
            <p>真空发生器的核心没有运动部件，气体本身就是“工作零件”。</p>
          </div>
          <div className="structure-list">
            {structures.map((item) => (
              <article className="structure-row" key={item.mark}>
                <span className="structure-mark">{item.mark}</span>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="formula-section" id="formula" aria-labelledby="formula-title">
          <div className="formula-intro">
            <p className="section-index">WHY IT WORKS</p>
            <h2 id="formula-title">快，为什么会带来低压？</h2>
            <p>
              对稳定流动的理想流体，伯努利方程揭示了速度与静压之间的此消彼长；
              在真实真空发生器中，还必须考虑气体可压缩性以及射流的动量交换。
            </p>
          </div>
          <div className="formula-display">
            <div className="formula">p + ½ρv² + ρgh = C</div>
            <p>位置高度近似不变时，流速 v 增大，静压 p 趋于降低。</p>
            <div className="formula-caption">伯努利方程 · 用于建立直观理解</div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <Wind size={24} aria-hidden="true" />
          <strong>从正压，到负压。</strong>
        </div>
        <a href="#top">回到顶部 <ArrowUp size={17} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
