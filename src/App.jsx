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
import {
  locationsData,
  animationComponents,
  createRubyHTML,
} from "./data/locationsData";

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
          <h4
            style={{ margin: "0 0 8px 0", color: "#fa6120" }}
            dangerouslySetInnerHTML={createRubyHTML(
              location.currentDescription.title,
            )}
          />
          {location.currentDescription.content && (
            <p
              dangerouslySetInnerHTML={createRubyHTML(
                location.currentDescription.content,
              )}
            />
          )}

          {location.currentDescription.keyPoints &&
            location.currentDescription.keyPoints.length > 0 && (
              <div className="tooltip-key-points">
                {location.currentDescription.keyPoints.map(
                  (keyPoint, index) => {
                    const icons = {
                      fact: "📌",
                      impact: "💡",
                      life: "🌿",
                      culture: "🏺",
                    };
                    return (
                      <div key={index} className="tooltip-key-point">
                        <span className="tooltip-key-point-icon">
                          {icons[keyPoint.type]}
                        </span>
                        <span
                          className="tooltip-key-point-text"
                          dangerouslySetInnerHTML={createRubyHTML(
                            keyPoint.text,
                          )}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            )}

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
  // 前回の拠点データ（フェードアウト用）
  const [prevFilteredLocations, setPrevFilteredLocations] = useState([]);
  // フェードアウト中の拠点を管理
  const [fadingOutLocations, setFadingOutLocations] = useState(new Set());
  // 地球儀の回転角度を管理 [経度, 緯度, ロール]
  const [rotation, setRotation] = useState([-80, 0, 0]);
  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState([-80, 0, 0]);

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

  // フィルタリングされた拠点が変わった時の処理
  useEffect(() => {
    // 消えるアニメーションを検出
    const newFadingOut = new Set();
    prevFilteredLocations.forEach((prevLoc) => {
      const currentLoc = filteredLocations.find(
        (loc) => loc.name === prevLoc.name,
      );
      if (
        prevLoc.animations.length > 0 &&
        currentLoc &&
        currentLoc.animations.length === 0
      ) {
        newFadingOut.add(prevLoc.name);
      }
    });

    if (newFadingOut.size > 0) {
      setFadingOutLocations(newFadingOut);
      // フェードアウトアニメーション後にクリア
      setTimeout(() => {
        setFadingOutLocations(new Set());
        setPrevFilteredLocations(filteredLocations);
      }, 500); // CSSのアニメーション時間と同じ
    } else {
      setPrevFilteredLocations(filteredLocations);
    }
  }, [filteredLocations]);

  // 地球儀の回転イベント
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setRotationStart(rotation);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // 感度を調整（0.5倍）
    const newRotation = [
      rotationStart[0] + deltaX * 0.5,
      Math.max(-90, Math.min(90, rotationStart[1] - deltaY * 0.5)), // 緯度は-90から90の範囲に制限
      0,
    ];

    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // グローバルなマウスイベントを設定
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, rotationStart]);

  // 拠点が地球の表側にあるかどうかを判定
  const isLocationVisible = (coordinates) => {
    const [lon, lat] = coordinates;
    const [rotLon, rotLat] = rotation;

    // 回転後の経度差を計算
    let lonDiff = lon - -rotLon;

    // -180から180の範囲に正規化
    while (lonDiff > 180) lonDiff -= 360;
    while (lonDiff < -180) lonDiff += 360;

    // 緯度差を計算
    const latDiff = lat - rotLat;

    // 表側の条件：経度差が-90度から90度の範囲内
    // かつ緯度が極端に離れていない
    const isVisible = Math.abs(lonDiff) < 90;

    return isVisible;
  };

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
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
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
            projection="geoOrthographic"
            projectionConfig={{
              scale: 380,
              rotate: rotation,
              center: [0, 10],
            }}
          >
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
                        pointerEvents: "none",
                      },
                      hover: { fill: "#E2E6EA", outline: "none" },
                      pressed: { fill: "#E2E6EA", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* 各拠点のマーカー */}
            {filteredLocations.map((location) => {
              const isFadingOut = fadingOutLocations.has(location.name);
              const prevLocation = prevFilteredLocations.find(
                (loc) => loc.name === location.name,
              );

              // 表示するアニメーションを決定
              const displayAnimations =
                isFadingOut && prevLocation
                  ? prevLocation.animations
                  : location.animations;

              // アニメーションがない場合はスキップ（フェードアウト中は表示）
              if (displayAnimations.length === 0) return null;

              // 地球の裏側にある場合は非表示
              if (!isLocationVisible(location.coordinates)) return null;
              const sizes = getAnimationSizes();
              const pos = getAnimationPosition(
                location.position,
                displayAnimations,
              );
              // 各アニメーションの幅を合計
              const width = displayAnimations.reduce((sum, anim) => {
                const size = anim.size === "small" ? sizes.small : sizes.normal;
                return sum + size;
              }, 0);
              // 最大の高さを取得
              const height = Math.max(
                ...displayAnimations.map((anim) =>
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
                <Marker key={location.name} coordinates={location.coordinates}>
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
                    <div
                      className={`animation-container ${isFadingOut ? "fade-out" : ""}`}
                    >
                      {displayAnimations.map((anim, index) => {
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
                    className={`location-label ${isFadingOut ? "fade-out" : ""}`}
                    style={{ pointerEvents: "none" }}
                  >
                    {location.name}
                  </text>
                </Marker>
              );
            })}
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

          {/* スライダーと時代区分の目印 */}
          <div className="slider-container">
            {/* 時代区分の目印 */}
            <div className="era-markers">
              <div
                className="era-marker"
                style={{ left: `${yearToSlider(-3000)}%` }}
              >
                <div className="era-marker-dot"></div>
              </div>
              <div
                className="era-marker"
                style={{ left: `${yearToSlider(500)}%` }}
              >
                <div className="era-marker-dot"></div>
              </div>
              <div
                className="era-marker"
                style={{ left: `${yearToSlider(1500)}%` }}
              >
                <div className="era-marker-dot"></div>
              </div>
              <div
                className="era-marker"
                style={{ left: `${yearToSlider(1800)}%` }}
              >
                <div className="era-marker-dot"></div>
              </div>
              <div
                className="era-marker"
                style={{ left: `${yearToSlider(1945)}%` }}
              >
                <div className="era-marker-dot"></div>
              </div>
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
          </div>

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
            <h3
              dangerouslySetInnerHTML={createRubyHTML(
                rightPanelContent.description.title,
              )}
            />

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

            <p
              dangerouslySetInnerHTML={createRubyHTML(
                rightPanelContent.description.content,
              )}
            />

            {rightPanelContent.description.detailContent && (
              <div className="detail-sections">
                {rightPanelContent.description.detailContent.sections.map(
                  (section, index) => (
                    <div key={index} className="detail-section">
                      <h4>{section.heading}</h4>
                      <p
                        dangerouslySetInnerHTML={createRubyHTML(section.text)}
                      />
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
