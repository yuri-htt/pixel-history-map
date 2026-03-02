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
  animationDescriptions,
  eraDefinitions,
  getEraByYear,
} from "./data";

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

// アニメーションをグループ化する関数
const groupAnimations = (animations) => {
  const groups = new Map();
  const noGroup = [];

  animations.forEach((anim) => {
    if (anim.group) {
      if (!groups.has(anim.group)) {
        groups.set(anim.group, []);
      }
      groups.get(anim.group).push(anim);
    } else {
      noGroup.push(anim);
    }
  });

  const result = [];
  groups.forEach((anims, groupName) => {
    result.push({ groupName, animations: anims });
  });
  noGroup.forEach((anim) => {
    result.push({ groupName: null, animations: [anim] });
  });

  return result;
};

// グループのレイアウトを計算する関数
const calculateGroupLayout = (groupedAnimations, position) => {
  const MARGIN = 10; // 拠点マークからの距離
  const GROUP_GAP = 5; // グループ間の距離
  const MAX_COLS = 4; // 横に並べる最大数
  const LABEL_HEIGHT = 14; // グループラベルの高さ（6pxフォント + パディング）
  const sizes = getAnimationSizes();

  // 各グループのサイズとレイアウトを計算
  const groupLayouts = groupedAnimations.map((group) => {
    const anims = group.animations;

    // アニメーションを最大4個ずつの行に分割
    const rows = [];
    for (let i = 0; i < anims.length; i += MAX_COLS) {
      rows.push(anims.slice(i, i + MAX_COLS));
    }

    // 各行の幅と高さを計算
    const rowWidths = rows.map((row) =>
      row.reduce((sum, anim) => {
        const size = anim.size === "small" ? sizes.small : sizes.normal;
        return sum + size;
      }, 0)
    );
    const rowHeights = rows.map((row) =>
      Math.max(
        ...row.map((anim) =>
          anim.size === "small" ? sizes.small : sizes.normal
        )
      )
    );

    const width = Math.max(...rowWidths);
    const animationsHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    const height = animationsHeight + (group.groupName ? LABEL_HEIGHT : 0);

    return {
      ...group,
      rows,
      width,
      height,
      animationsHeight,
      rowWidths,
      rowHeights,
    };
  });

  // 全体の幅と高さを計算（横方向にグループを配置）
  const totalWidth = groupLayouts.reduce((sum, g) => sum + g.width, 0) +
                     GROUP_GAP * Math.max(0, groupLayouts.length - 1);
  const totalHeight = Math.max(...groupLayouts.map((g) => g.height));

  // 基準位置を計算
  const positions = {
    上: { x: -totalWidth / 2, y: -totalHeight - MARGIN },
    下: { x: -totalWidth / 2, y: MARGIN + 5 },
    左: { x: -totalWidth - MARGIN, y: -totalHeight / 2 },
    右: { x: MARGIN, y: -totalHeight / 2 },
    左上: { x: -totalWidth - MARGIN, y: -totalHeight - MARGIN },
    右上: { x: MARGIN, y: -totalHeight - MARGIN },
    左下: { x: -totalWidth - MARGIN, y: MARGIN },
    右下: { x: MARGIN, y: MARGIN },
  };

  const basePos = positions[position] || positions["上"];

  // 各グループの位置を計算
  let currentX = 0;
  groupLayouts.forEach((group) => {
    group.x = currentX;
    group.y = 0;
    currentX += group.width + GROUP_GAP;
  });

  return {
    groupLayouts,
    totalWidth,
    totalHeight,
    basePos,
  };
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
      <h3
        dangerouslySetInnerHTML={
          location?.displayName
            ? createRubyHTML(location.displayName)
            : { __html: locationName }
        }
      />
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
  // hover中のアニメーションを管理 (animKey, animType)
  const [hoveredAnimation, setHoveredAnimation] = useState(null);
  // ツールチップの位置を管理
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // スライダー値から年代を計算
  const year = useMemo(() => sliderToYear(sliderValue), [sliderValue]);

  // 現在の時代を取得
  const currentEra = useMemo(() => getEraByYear(year), [year]);

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

    // 度数法からラジアンに変換
    const toRad = (deg) => (deg * Math.PI) / 180;

    // 拠点の3D座標を計算（球面座標から直交座標へ）
    const pointLonRad = toRad(lon);
    const pointLatRad = toRad(lat);
    const pointX = Math.cos(pointLatRad) * Math.cos(pointLonRad);
    const pointY = Math.cos(pointLatRad) * Math.sin(pointLonRad);
    const pointZ = Math.sin(pointLatRad);

    // カメラの向き（回転の逆方向）を計算
    const viewLonRad = toRad(-rotLon);
    const viewLatRad = toRad(-rotLat);
    const viewX = Math.cos(viewLatRad) * Math.cos(viewLonRad);
    const viewY = Math.cos(viewLatRad) * Math.sin(viewLonRad);
    const viewZ = Math.sin(viewLatRad);

    // 内積を計算（ドット積）
    // 内積が正の場合、点はカメラの方向を向いている（表側）
    const dotProduct = pointX * viewX + pointY * viewY + pointZ * viewZ;

    return dotProduct > 0;
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

              // アニメーションをグループ化してレイアウトを計算
              const groupedAnimations = groupAnimations(displayAnimations);
              const layout = calculateGroupLayout(groupedAnimations, location.position);

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
                    x={layout.basePos.x}
                    y={layout.basePos.y}
                    width={layout.totalWidth + 10}
                    height={layout.totalHeight + 10}
                    style={{ pointerEvents: "auto", overflow: "visible" }}
                  >
                    <div
                      className={`animation-groups-container ${isFadingOut ? "fade-out" : ""}`}
                      style={{
                        pointerEvents: "auto",
                        display: "flex",
                        gap: "5px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {layout.groupLayouts.map((groupLayout, groupIndex) => {
                        return (
                          <div
                            key={groupIndex}
                            className="animation-group"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {/* アニメーション */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0px",
                              }}
                            >
                              {groupLayout.rows.map((row, rowIndex) => {
                                return (
                                  <div
                                    key={rowIndex}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      gap: "0px",
                                    }}
                                  >
                                    {row.map((anim, colIndex) => {
                                      const globalIndex = groupLayout.animations.indexOf(anim);
                                      const sizeClass =
                                        anim.size === "small" ? "small" : "normal";
                                      const animKey = `${location.name}-${groupIndex}-${globalIndex}`;
                                      return (
                                        <div
                                          key={colIndex}
                                          className="animation-wrapper"
                                          style={{ pointerEvents: "auto" }}
                                          onMouseEnter={(e) => {
                                            const rect =
                                              e.currentTarget.getBoundingClientRect();
                                            setTooltipPosition({
                                              x: rect.left + rect.width / 2,
                                              y: rect.top - 10,
                                            });
                                            setHoveredAnimation({
                                              key: animKey,
                                              type: anim.type,
                                            });
                                          }}
                                          onMouseLeave={() => {
                                            setHoveredAnimation(null);
                                          }}
                                        >
                                          <div
                                            className={`${animationComponents[anim.type]} ${sizeClass}`}
                                            style={{ pointerEvents: "auto" }}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>

                            {/* グループラベル */}
                            {groupLayout.groupName && (
                              <div className="animation-group-label">
                                {groupLayout.groupName}
                              </div>
                            )}
                          </div>
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

          {/* アニメーションツールチップ */}
          {hoveredAnimation && (
            <div
              className="animation-tooltip"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {animationDescriptions[hoveredAnimation.type] || ""}
            </div>
          )}
        </div>

        {/* --- UIエリア --- */}
        <div className="ui-panel">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {currentEra && (
              <div className="era-info">
                <span className="era-label">{currentEra.label}</span>
                <span className="era-description">
                  {currentEra.description}
                </span>
              </div>
            )}
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
