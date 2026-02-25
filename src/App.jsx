import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import "./App.css";
import { locationsData, animationComponents } from "./data/locationsData";

// 世界地図データ
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// アニメーションサイズをCSS変数から取得
const getAnimationSizes = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  return {
    normal: parseInt(computedStyle.getPropertyValue("--animation-size")) || 20,
    small:
      parseInt(computedStyle.getPropertyValue("--animation-size-small")) || 16,
  };
};

// 位置計算関数
const getAnimationPosition = (position, animations) => {
  const MARGIN = 10; // 拠点マークからの距離
  const sizes = getAnimationSizes();
  // 各アニメーションの幅を合計
  const totalWidth = animations.reduce((sum, anim) => {
    const size = anim.size === "small" ? sizes.small : sizes.normal;
    return sum + size;
  }, 0);
  // 最大の高さを取得
  const totalHeight = Math.max(
    ...animations.map((anim) =>
      anim.size === "small" ? sizes.small : sizes.normal,
    ),
  );

  const positions = {
    上: { x: -totalWidth / 2, y: -totalHeight - MARGIN },
    下: { x: -totalWidth / 2, y: MARGIN + 5 }, // 地名分5px下にずらす
    左: { x: -totalWidth - MARGIN, y: -totalHeight / 2 },
    右: { x: MARGIN, y: -totalHeight / 2 },
    左上: { x: -totalWidth - MARGIN, y: -totalHeight - MARGIN },
    右上: { x: MARGIN, y: -totalHeight - MARGIN },
    左下: { x: -totalWidth - MARGIN, y: MARGIN },
    右下: { x: MARGIN, y: MARGIN },
  };

  return positions[position] || positions["上"];
};

// スライダー値から実際の年代への変換（非線形）
const sliderToYear = (sliderValue) => {
  // スライダー: 0-100
  // 年代: -14000 ~ 2026

  if (sliderValue <= 50) {
    // 0-50: 紀元前14000年 ~ 紀元前1年 (前半で大きく変化)
    const ratio = sliderValue / 50;
    // 指数関数的に変化させる（前半はゆっくり、後半は早く）
    const exponentialRatio = Math.pow(ratio, 2);
    return Math.round(-14000 + 14000 * exponentialRatio);
  } else {
    // 51-100: 紀元1年 ~ 2026年 (後半で細かく変化)
    const ratio = (sliderValue - 50) / 50;
    return Math.round(1 + 2025 * ratio);
  }
};

// 年代からスライダー値への逆変換
const yearToSlider = (year) => {
  if (year < 0) {
    // 紀元前の場合
    const progress = (year + 14000) / 14000;
    const sliderRatio = Math.sqrt(progress); // 平方根で逆変換
    return Math.round(sliderRatio * 50);
  } else {
    // 紀元後の場合
    const progress = (year - 1) / 2025;
    return Math.round(50 + progress * 50);
  }
};

// 年代に応じてアクティビティをフィルタリングする関数
const filterActivitiesByYear = (activities, currentYear) => {
  return activities.filter((activity) => {
    const isAfterStart = currentYear >= activity.startYear;
    const isBeforeEnd =
      activity.endYear === null || currentYear <= activity.endYear;
    return isAfterStart && isBeforeEnd;
  });
};

// 各拠点のポップアップコンポーネント
function LocationTooltip({
  locationName,
  isVisible,
  onClose,
  locationRef,
  placement,
  offsetValue,
  filteredLocations,
  onShowDetail,
}) {
  const { refs, floatingStyles } = useFloating({
    placement: placement,
    strategy: "absolute",
    middleware: [offset(offsetValue), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // 参照要素を設定
  useEffect(() => {
    if (locationRef) {
      refs.setReference(locationRef);
    }
  }, [locationRef, refs]);

  const location = filteredLocations.find((loc) => loc.name === locationName);

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.2s",
      }}
      className="location-tooltip"
    >
      <button className="tooltip-close" onClick={onClose}>
        ×
      </button>
      <h3>{locationName}</h3>
      {location?.currentDescription ? (
        <>
          <h4 style={{ margin: "0 0 8px 0", color: "#fa6120" }}>
            {location.currentDescription.title}
          </h4>
          <p>{location.currentDescription.content}</p>
          <button
            className="detail-button"
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail(locationName, location.currentDescription);
            }}
          >
            詳しく見る
          </button>
        </>
      ) : (
        <p>
          ここでは{locationName}の歴史的な活動が行われています。
          紀元前14000年頃から様々な文明の営みが始まりました。
        </p>
      )}
    </div>
  );
}

function App() {
  // スライダーの値を管理 (0-100)
  const [sliderValue, setSliderValue] = useState(0);
  // hover中の拠点名を管理
  const [hoveredLocation, setHoveredLocation] = useState(null);
  // hover解除中（縮小アニメーション中）の拠点名を管理
  const [shrinkingLocation, setShrinkingLocation] = useState(null);
  // 表示するポップアップの拠点名を管理（nullの場合は非表示）
  const [clickedLocation, setClickedLocation] = useState(null);
  // 右カラムの展開状態を管理
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState(null);
  // 参照要素のマップ
  const locationRefs = useRef({});

  // スライダー値から年代を計算
  const year = useMemo(() => sliderToYear(sliderValue), [sliderValue]);

  // 表示用の年のテキスト作成
  const yearText =
    year < 0
      ? `紀元前 ${Math.abs(year).toLocaleString()} 年`
      : `西暦 ${year.toLocaleString()} 年`;

  // 現在から何年前かを計算
  const currentYear = 2026;
  const yearsAgo = currentYear - year;
  const yearsAgoText = yearsAgo > 0 ? `約${yearsAgo.toLocaleString()}年前` : "";

  // 現在の年代でフィルタリングされた拠点データ
  const filteredLocations = useMemo(() => {
    return locationsData.map((location) => ({
      ...location,
      animations: filterActivitiesByYear(location.activities, year),
      currentDescription: location.descriptions
        ? filterActivitiesByYear(location.descriptions, year)[0]
        : null,
    }));
  }, [year]);

  // 各拠点のFloating UI設定を作成する関数
  const getTooltipConfig = (locationName) => {
    const location = locationsData.find((loc) => loc.name === locationName);
    if (!location) return { placement: "top", offset: 10 };

    const position = location.position;

    // アニメーションが上側にある場合
    if (position === "上" || position === "左上" || position === "右上") {
      return { placement: "bottom", offset: 30 };
    }
    // アニメーションが下側にある場合
    if (position === "左下" || position === "右下") {
      return { placement: "bottom", offset: 70 };
    }
    // アニメーションが真下にある場合
    if (position === "下") {
      return { placement: "bottom", offset: 80 };
    }
    // アニメーションが左右にある場合
    return { placement: "top", offset: 10 };
  };

  return (
    <div className="app-container">
      {/* メインコンテンツエリア */}
      <div className={`main-content ${isRightPanelOpen ? "shifted" : ""}`}>
        {/* --- 地図エリア --- */}
        <div
          className="map-wrapper"
          onClick={() => {
            // 地図の背景をクリックしたらポップアップを閉じる
            if (clickedLocation) {
              setClickedLocation(null);
            }
          }}
        >
          <ComposableMap
            width={800}
            height={400}
            projectionConfig={{ scale: 147 }}
          >
            <ZoomableGroup center={[0, 0]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#E2E6EA",
                          outline: "none",
                          stroke: "none",
                        },
                        hover: { fill: "#E2E6EA", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* 各拠点のマーカー */}
              {filteredLocations.map((location) => {
                // アニメーションがない場合はスキップ
                if (location.animations.length === 0) return null;
                const sizes = getAnimationSizes();
                const pos = getAnimationPosition(
                  location.position,
                  location.animations,
                );
                // 各アニメーションの幅を合計
                const width = location.animations.reduce((sum, anim) => {
                  const size =
                    anim.size === "small" ? sizes.small : sizes.normal;
                  return sum + size;
                }, 0);
                // 最大の高さを取得
                const height = Math.max(
                  ...location.animations.map((anim) =>
                    anim.size === "small" ? sizes.small : sizes.normal,
                  ),
                );

                const isHovered = hoveredLocation === location.name;
                const isShrinking = shrinkingLocation === location.name;
                const showCircle = isHovered || isShrinking;

                const handleMouseEnter = () => {
                  setShrinkingLocation(null);
                  setHoveredLocation(location.name);
                };

                const handleMouseLeave = () => {
                  setHoveredLocation(null);
                  setShrinkingLocation(location.name);
                  // 縮小アニメーション後に状態をクリア
                  setTimeout(() => {
                    setShrinkingLocation((current) =>
                      current === location.name ? null : current,
                    );
                  }, 300); // アニメーション時間と同じ
                };

                const handleClick = (e) => {
                  e.stopPropagation();
                  // 同じ拠点をクリックした場合は閉じる、別の拠点の場合は切り替える
                  if (clickedLocation === location.name) {
                    setClickedLocation(null);
                  } else {
                    setClickedLocation(location.name);
                  }
                };

                return (
                  <Marker
                    key={location.name}
                    coordinates={location.coordinates}
                  >
                    {/* Hover時の拡大円 */}
                    {showCircle && (
                      <circle
                        r={3}
                        fill="#FA6120"
                        opacity="0.6"
                        className={`hover-circle ${isShrinking ? "shrink" : ""}`}
                      />
                    )}

                    <foreignObject
                      x={pos.x}
                      y={pos.y}
                      width={width}
                      height={height}
                    >
                      <div className="animation-container">
                        {location.animations.map((anim, index) => {
                          const sizeClass =
                            anim.size === "small" ? "small" : "normal";
                          return (
                            <div
                              key={index}
                              className={`${animationComponents[anim.type]} ${sizeClass}`}
                            />
                          );
                        })}
                      </div>
                    </foreignObject>

                    <circle
                      r={3}
                      fill="#FA6120"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleClick}
                      ref={(el) => {
                        if (el) locationRefs.current[location.name] = el;
                      }}
                    />

                    <text
                      textAnchor="middle"
                      y={12}
                      className="location-label"
                      style={{ pointerEvents: "none" }}
                    >
                      {location.name}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* --- UIエリア --- */}
        <div className="ui-panel">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <h1 className="year-display">{yearText}</h1>
            {yearsAgoText && (
              <span style={{ fontSize: "1rem", color: "#999" }}>
                {yearsAgoText}
              </span>
            )}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            className="timeline-slider"
          />
          <p className="description">スライダーを動かして歴史を観測しよう</p>
        </div>

        {/* 全拠点のポップアップを事前にレンダリング */}
        {locationsData.map((locationData) => {
          const config = getTooltipConfig(locationData.name);
          return (
            <LocationTooltip
              key={locationData.name}
              locationName={locationData.name}
              isVisible={clickedLocation === locationData.name}
              onClose={() => setClickedLocation(null)}
              locationRef={locationRefs.current[locationData.name]}
              placement={config.placement}
              offsetValue={config.offset}
              filteredLocations={filteredLocations}
              onShowDetail={(name, description) => {
                setRightPanelContent({ locationName: name, description });
                setIsRightPanelOpen(true);
              }}
            />
          );
        })}
      </div>

      {/* 右カラム */}
      <div className={`right-panel ${isRightPanelOpen ? "open" : ""}`}>
        <button
          className="panel-close"
          onClick={() => setIsRightPanelOpen(false)}
        >
          ×
        </button>
        {rightPanelContent && (
          <div className="panel-content">
            <h2>{rightPanelContent.locationName}</h2>
            <h3>{rightPanelContent.description.title}</h3>

            {rightPanelContent.description.period && (
              <p className="period-text">
                {rightPanelContent.description.period}
              </p>
            )}

            {rightPanelContent.description.image && (
              <img
                src={rightPanelContent.description.image}
                alt={rightPanelContent.description.title}
                className="detail-image"
              />
            )}

            {rightPanelContent.description.detailContent && (
              <div className="detail-sections">
                {rightPanelContent.description.detailContent.sections.map(
                  (section, index) => (
                    <div key={index} className="detail-section">
                      <h4>{section.heading}</h4>
                      <p>{section.text}</p>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
