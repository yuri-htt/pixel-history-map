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
  autoRuby,
  getSubPeriodYears,
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
      }, 0),
    );
    const rowHeights = rows.map((row) =>
      Math.max(
        ...row.map((anim) =>
          anim.size === "small" ? sizes.small : sizes.normal,
        ),
      ),
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
  const totalWidth =
    groupLayouts.reduce((sum, g) => sum + g.width, 0) +
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
    return sliderRatio * 50; // 丸めずに小数を返す
  } else {
    // 紀元後の場合
    const progress = (year - 1) / 2025;
    return 50 + progress * 50; // 丸めずに小数を返す
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

// 年代に応じてdescriptionsをフィルタリングする関数
// eraSubPeriodsByRegionから年代情報を取得する
const filterDescriptionsByYear = (descriptions, currentYear, regionId) => {
  return descriptions.filter((description) => {
    const years = getSubPeriodYears(regionId, description.eraId, description.subPeriodId);
    if (!years) return false;

    const isAfterStart = currentYear >= years.startYear;
    const isBeforeEnd = years.endYear === null || currentYear <= years.endYear;
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
  // 前回の年を記録
  const [prevYear, setPrevYear] = useState(-14000);
  // 地球儀の回転角度を管理 [経度, 緯度, ロール]
  const [rotation, setRotation] = useState([-80, 0, 0]);
  // 地球儀のドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState([-80, 0, 0]);
  // スライダーのドラッグ状態
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [sliderDragStart, setSliderDragStart] = useState({ x: 0, value: 0 });
  const sliderContainerRef = useRef(null);
  // hover中のアニメーションを管理 (animKey, animType)
  const [hoveredAnimation, setHoveredAnimation] = useState(null);
  // ツールチップの位置を管理
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  // 猫ちゃんの吹き出しメッセージ
  const [tetoMessage, setTetoMessage] = useState(null);
  // 吹き出しのタイムアウトIDを管理
  const tetoTimeoutRef = useRef(null);
  // 猫ちゃんが起きているかどうか
  const [isTetoAwake, setIsTetoAwake] = useState(false);
  // 時代タブのコンテナRef
  const eraTabsContainerRef = useRef(null);
  // プログラムによるスクロール中かどうかのフラグ
  const isProgrammaticScrollRef = useRef(false);

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

  // アニメーション登場タイミングを収集（重複を除く）
  const activityStartYears = useMemo(() => {
    const years = new Set();
    locationsData.forEach((location) => {
      location.activities.forEach((activity) => {
        years.add(activity.startYear);
      });
    });
    return Array.from(years).sort((a, b) => a - b);
  }, []);

  // 現在の年代でフィルタリングされた拠点データ
  const filteredLocations = useMemo(() => {
    return locationsData.map((location) => ({
      ...location,
      animations: filterActivitiesByYear(location.activities, year),
      currentDescription: location.descriptions
        ? filterDescriptionsByYear(location.descriptions, year, location.regionId)[0]
        : null,
    }));
  }, [year]);

  // フィルタリングされた拠点が変わった時の処理
  useEffect(() => {
    // 年が変わっていない場合は何もしない
    if (year === prevYear) {
      return;
    }

    // 前回の年のfilteredLocationsを計算
    const prevYearFilteredLocations = locationsData.map((location) => ({
      ...location,
      animations: filterActivitiesByYear(location.activities, prevYear),
    }));

    // 消えるアニメーションを検出
    const newFadingOut = new Set();
    prevYearFilteredLocations.forEach((prevLoc) => {
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

    // 新しく現れたアクティビティを検出
    const newActivities = [];

    filteredLocations.forEach((currentLoc) => {
      const prevLoc = prevYearFilteredLocations.find(
        (loc) => loc.name === currentLoc.name,
      );

      if (prevLoc) {
        currentLoc.animations.forEach((currentAnim) => {
          const existed = prevLoc.animations.some(
            (prevAnim) => prevAnim.type === currentAnim.type,
          );
          // 年が現在の年と前回の年の範囲内にあるかチェック
          const yearInRange =
            currentAnim.startYear > prevYear && currentAnim.startYear <= year;

          if (!existed && yearInRange) {
            newActivities.push({
              location: currentLoc.name,
              displayName: currentLoc.displayName || currentLoc.name,
              type: currentAnim.type,
              group: currentAnim.group,
            });
          }
        });
      }
    });

    // 新しいアクティビティがあれば猫ちゃんのメッセージを表示
    if (newActivities.length > 0) {
      const activity = newActivities[0];
      // displayNameとgroupに自動的にルビを振る
      const locationWithRuby = autoRuby(activity.displayName);
      const groupWithRuby = autoRuby(activity.group);
      const message = `${locationWithRuby}で、<br/>はじめて${groupWithRuby}が行われるようになったにゃ！`;

      // 猫ちゃんを起こす
      setIsTetoAwake(true);
      setTetoMessage(message);

      // 既存のタイムアウトをクリア
      if (tetoTimeoutRef.current) {
        clearTimeout(tetoTimeoutRef.current);
      }

      // 11秒後にメッセージを消して猫ちゃんを寝かせる
      tetoTimeoutRef.current = setTimeout(() => {
        setTetoMessage(null);
        setIsTetoAwake(false);
        tetoTimeoutRef.current = null;
      }, 11000);
    }

    // フェードアウト処理と状態更新
    if (newFadingOut.size > 0) {
      setFadingOutLocations(newFadingOut);
      setTimeout(() => {
        setFadingOutLocations(new Set());
        setPrevFilteredLocations(filteredLocations);
        setPrevYear(year);
      }, 500);
    } else {
      setPrevFilteredLocations(filteredLocations);
      setPrevYear(year);
    }
  }, [filteredLocations, year, prevYear]);

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

  // スライダーのドラッグイベント
  const handleSliderMouseDown = (e) => {
    setIsSliderDragging(true);
    setSliderDragStart({
      x: e.clientX,
      scrollLeft: sliderContainerRef.current.scrollLeft,
    });
  };

  const handleSliderMouseMove = (e) => {
    if (!isSliderDragging) return;

    const deltaX = e.clientX - sliderDragStart.x;
    // ドラッグした距離分だけスクロール位置を変更
    sliderContainerRef.current.scrollLeft = sliderDragStart.scrollLeft - deltaX;
  };

  const handleSliderMouseUp = () => {
    setIsSliderDragging(false);
  };

  // スライダーのグローバルなマウスイベントを設定
  useEffect(() => {
    if (isSliderDragging) {
      window.addEventListener("mousemove", handleSliderMouseMove);
      window.addEventListener("mouseup", handleSliderMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleSliderMouseMove);
        window.removeEventListener("mouseup", handleSliderMouseUp);
      };
    }
  }, [isSliderDragging, sliderDragStart]);

  // スクロール位置から年を計算する関数
  const calculateYearFromScroll = () => {
    if (!sliderContainerRef.current) return year;

    const container = sliderContainerRef.current;
    const wrapper = container.querySelector('.slider-wrapper');
    if (!wrapper) return year;

    // コンテナの幅と中央位置
    const containerWidth = container.offsetWidth;
    const centerX = containerWidth / 2;

    // スクロール位置と中央のX座標を計算
    const scrollLeft = container.scrollLeft;
    const centerScrollX = scrollLeft + centerX;

    // ラッパーの幅とパディング
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperStyle = getComputedStyle(wrapper);
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;

    // スライダーの実際の範囲（パディングを除く）
    const sliderStart = paddingLeft;
    const sliderEnd = wrapperWidth - paddingLeft;
    const sliderWidth = sliderEnd - sliderStart;

    // 中央マークがスライダーのどの位置にあるか（0-100のパーセント）
    const relativePosition = Math.max(0, Math.min(100,
      ((centerScrollX - sliderStart) / sliderWidth) * 100
    ));

    // パーセントから年を計算
    return sliderToYear(relativePosition);
  };

  // スクロールイベントで年を更新
  useEffect(() => {
    const container = sliderContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // プログラムによるスクロール中は状態を更新しない
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const newYear = calculateYearFromScroll();
      const newSliderValue = yearToSlider(newYear);
      setSliderValue(newSliderValue);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 指定した年が中央に来るようにスクロールする関数
  const scrollToYear = (targetYear, smooth = true) => {
    if (!sliderContainerRef.current) return;

    const container = sliderContainerRef.current;
    const wrapper = container.querySelector('.slider-wrapper');
    if (!wrapper) return;

    // プログラムによるスクロールフラグを設定
    isProgrammaticScrollRef.current = true;

    // 目標の年に対応するスライダー値を計算して状態を更新
    const targetSliderValue = yearToSlider(targetYear);
    setSliderValue(targetSliderValue);

    // ラッパーの幅とパディング
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperStyle = getComputedStyle(wrapper);
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;

    // スライダーの実際の範囲
    const sliderStart = paddingLeft;
    const sliderEnd = wrapperWidth - paddingLeft;
    const sliderWidth = sliderEnd - sliderStart;

    // 目標位置を計算
    const targetPosition = (targetSliderValue / 100) * sliderWidth + sliderStart;

    // コンテナの中央位置
    const containerWidth = container.offsetWidth;
    const centerX = containerWidth / 2;

    // 中央に来るようにスクロール
    const scrollLeft = targetPosition - centerX;

    if (smooth) {
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
      // スムーズスクロールの場合、アニメーション終了後にフラグをクリア
      // スクロールアニメーションの完了を待つ（1000msに延長）
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
    } else {
      container.scrollLeft = scrollLeft;
      // 即座のスクロールの場合、少し遅延させてからフラグをクリア
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);
    }
  };

  // マーカー要素を中央にスクロールする関数
  const scrollToMarker = (markerElement) => {
    if (!sliderContainerRef.current || !markerElement) return;

    const container = sliderContainerRef.current;
    const wrapper = container.querySelector('.slider-wrapper');
    if (!wrapper) return;

    // プログラムによるスクロールフラグを設定
    isProgrammaticScrollRef.current = true;

    // コンテナの幅と中央位置
    const containerWidth = container.offsetWidth;
    const centerX = containerWidth / 2;

    // 現在のスクロール位置
    const currentScrollLeft = container.scrollLeft;

    // コンテナとマーカーの位置を取得
    const containerRect = container.getBoundingClientRect();
    const markerRect = markerElement.getBoundingClientRect();

    // マーカーの現在の画面上での位置（コンテナ左端からの距離）
    const markerOffsetFromContainerLeft = markerRect.left - containerRect.left;

    // マーカーが中央に来るために必要なスクロール量
    const targetScrollLeft = currentScrollLeft + markerOffsetFromContainerLeft - centerX;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });

    // スムーズスクロールなので、アニメーション終了後にフラグをクリア
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);
  };

  // 初期表示時に開始年（-14000年）を中央にスクロール
  useEffect(() => {
    // 少し遅延させてDOMが完全にレンダリングされてから実行
    const timer = setTimeout(() => {
      scrollToYear(-14000, false); // スムーズスクロールなし
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  // 猫ちゃんの吹き出しを閉じる関数
  const handleCloseSpeechBubble = () => {
    if (tetoTimeoutRef.current) {
      clearTimeout(tetoTimeoutRef.current);
      tetoTimeoutRef.current = null;
    }
    setTetoMessage(null);
    setIsTetoAwake(false);
  };

  // アクティブな時代タブを中央にスクロールする関数
  const scrollEraTabToCenter = (eraId) => {
    if (!eraTabsContainerRef.current) return;

    const container = eraTabsContainerRef.current;
    const activeTab = container.querySelector(`[data-era-id="${eraId}"]`);
    if (!activeTab) return;

    const containerWidth = container.offsetWidth;
    const centerX = containerWidth / 2;
    const currentScrollLeft = container.scrollLeft;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const tabOffsetFromContainerLeft = tabRect.left - containerRect.left;
    const tabCenter = tabOffsetFromContainerLeft + tabRect.width / 2;

    const targetScrollLeft = currentScrollLeft + tabCenter - centerX;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  // 前回の時代を追跡するref
  const prevEraRef = useRef(null);

  // 時代が変わったらタブをスクロール（ただしプログラムによるスクロール中は除く）
  useEffect(() => {
    if (currentEra && prevEraRef.current !== currentEra.id) {
      prevEraRef.current = currentEra.id;

      // プログラムによるスクロール中でない場合のみタブをスクロール
      // （つまり、ユーザーが手動でスライダーを動かした場合のみ）
      if (!isProgrammaticScrollRef.current) {
        const timer = setTimeout(() => {
          scrollEraTabToCenter(currentEra.id);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [currentEra]);

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
              const layout = calculateGroupLayout(
                groupedAnimations,
                location.position,
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
                    x={layout.basePos.x}
                    y={layout.basePos.y}
                    width={layout.totalWidth + 10}
                    height={layout.totalHeight + 10}
                    style={{
                      pointerEvents: "auto",
                      overflow: "visible",
                      transition:
                        "x 0.4s ease-out, y 0.4s ease-out, width 0.4s ease-out, height 0.4s ease-out",
                    }}
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
                                      const globalIndex =
                                        groupLayout.animations.indexOf(anim);
                                      const sizeClass =
                                        anim.size === "small"
                                          ? "small"
                                          : "normal";
                                      const animKey = `${location.name}-${groupIndex}-${globalIndex}`;
                                      return (
                                        <div
                                          key={colIndex}
                                          className={`animation-wrapper ${isFadingOut ? "fade-out" : ""}`}
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
                                            className={`${animationComponents[anim.type]} ${sizeClass} activity-animation`}
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
        {/* 中央固定の現在位置インジケーター */}
        <div className="timeline-indicator"></div>

        <div className="ui-panel">
          {/* 猫ちゃんアニメーション */}
          <div className="sleeping-teto-container">
            <div
              className={
                isTetoAwake ? "blinking-teto-animation" : "sleeping-teto-animation"
              }
            ></div>
            {tetoMessage && (
              <div className="teto-speech-bubble">
                <button
                  className="teto-speech-close"
                  onClick={handleCloseSpeechBubble}
                >
                  ×
                </button>
                <div dangerouslySetInnerHTML={{ __html: tetoMessage }} />
              </div>
            )}
          </div>

          {/* 年代と時代情報 */}
          <div className="ui-panel-info">
            {/* 時代区分タブ */}
            <div className="era-tabs-container" ref={eraTabsContainerRef}>
              <div className="era-tabs-wrapper">
                {eraDefinitions.map((era) => {
                  const isActive = currentEra && currentEra.id === era.id;
                  return (
                    <div
                      key={era.id}
                      data-era-id={era.id}
                      className={`era-tab ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        // その時代の開始年にジャンプ
                        const targetYear = era.startYear;
                        // scrollToYearが内部でsliderValueを計算して設定する
                        scrollToYear(targetYear);

                        // タブも中央にスクロール（少し遅延させてDOMの更新を待つ）
                        setTimeout(() => {
                          scrollEraTabToCenter(era.id);
                        }, 150);
                      }}
                    >
                      <div className="era-tab-label">
                        {era.label}
                      </div>
                      {isActive && (
                        <div className="era-tab-description">
                          {era.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 年代表示 */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <h1
                className="year-display"
                dangerouslySetInnerHTML={{ __html: autoRuby(yearText) }}
              />
              {yearsAgoText && (
                <span
                  style={{ fontSize: "1rem", color: "#999" }}
                  dangerouslySetInnerHTML={{ __html: autoRuby(yearsAgoText) }}
                />
              )}
            </div>
          </div>

          {/* スライダーと時代区分の目印 */}
          <div
            className="slider-container"
            ref={sliderContainerRef}
            onMouseDown={handleSliderMouseDown}
            style={{ cursor: isSliderDragging ? "grabbing" : "ew-resize" }}
          >
            <div className="slider-wrapper">
              {/* 内側のコンテンツラッパー（パディングなし、マーカーの基準） */}
              <div className="slider-content">
                {/* 時代区分の目印（暖色） */}
                <div className="era-markers">
                  {eraDefinitions.slice(1).filter((era) => {
                    const pos = yearToSlider(era.startYear);
                    // スライダー範囲（0-100%）内のみ表示
                    return pos >= 0 && pos <= 100;
                  }).map((era) => (
                    <div
                      key={era.id}
                      className="era-marker"
                      style={{ left: `${yearToSlider(era.startYear)}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToYear(era.startYear);
                      }}
                    >
                      <div className="era-marker-dot era"></div>
                    </div>
                  ))}
                </div>

                {/* アニメーション登場タイミングの目印（グレー・小さめ） */}
                <div className="activity-markers">
                  {activityStartYears.filter((startYear) => {
                    // スライダーの表示範囲（-14000〜2026年）内のみ表示
                    return startYear >= -14000 && startYear <= 2026;
                  }).map((startYear) => {
                    const pos = yearToSlider(startYear);
                    return (
                      <div
                        key={startYear}
                        className="activity-marker"
                        style={{ left: `${pos}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToYear(startYear);
                        }}
                      >
                        <div className="activity-marker-dot"></div>
                      </div>
                    );
                  })}
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
            </div>
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
