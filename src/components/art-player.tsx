// "use client";

// import Artplayer from "artplayer";
// import React, { useRef, useEffect } from "react";

// /* eslint-disable @typescript-eslint/no-explicit-any */
// const generateHighlights = (start: any, end: any, label: any) => {
//   if (start == null || end == null || start > end) return [];
//   const highlights = [];
//   for (let time = start; time <= end; time++) {
//     highlights.push({ time, text: `${label}` });
//   }
//   return highlights;
// };

// /* eslint-disable @typescript-eslint/no-explicit-any */
// function ArtPlayer({
//   intro,
//   outro,
//   tracks,
//   option,
//   getInstance,
//   artRef,
//   ...rest
// }: any) {
//   const artInstanceRef = useRef<Artplayer | null>(null);

//   useEffect(() => {
//     if (!artRef.current) return;

//     if (artInstanceRef.current) {
//       artInstanceRef.current.destroy(true);
//     }

//     const trackOptions: Array<{ default: boolean; html: string; url: string }> =
//       [];

//     tracks.map((track: { label: string; file: string; kind: string }) => {
//       if (track.kind === "captions") {
//         trackOptions.push({
//           default: track.label === "English",
//           html: track.label,
//           url: track.file,
//         });
//       }
//     });

//     const art = new Artplayer({
//       ...option,
//       container: artRef.current,
//       highlight: [
//         ...generateHighlights(intro?.start, intro?.end, "Intro"),
//         ...generateHighlights(outro?.start, outro?.end, "Outro"),
//       ],
//       settings: [
//         {
//           width: 250,
//           html: "Subtitle",
//           tooltip: "Subtitle",

//           selector: [
//             {
//               html: "Display",
//               tooltip: "Show",
//               switch: true,
//               onSwitch: function (item) {
//                 item.tooltip = item.switch ? "Hide" : "Show";
//                 art.subtitle.show = !item.switch;
//                 return !item.switch;
//               },
//             },
//             ...trackOptions,
//           ],
//           onSelect: function (item) {
//             art.subtitle.switch(item.url, {
//               name: item.html,
//             });
//             return item.html;
//           },
//         },
//       ],
//     });

//     artInstanceRef.current = art;

//     art.on("resize", () => {
//       art.subtitle.style({
//         fontSize: art.height * 0.04 + "px",
//       });
//     });

//     if (getInstance && typeof getInstance === "function") {
//       getInstance(art);
//     }

//     return () => {
//       if (artInstanceRef.current) {
//         art.destroy(true);
//       }
//     };
//     //eslint-disable-next-line
//   }, [option, intro, outro, tracks, artRef, getInstance]);

//   return <div ref={artRef} {...rest} style={{ background: "none" }}></div>;
// }
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export default ArtPlayer;

"use client"

import Artplayer from "artplayer"
import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

/* eslint-disable @typescript-eslint/no-explicit-any */
const generateHighlights = (start: any, end: any, label: any) => {
  if (start == null || end == null || start > end) return []
  const highlights = []
  for (let time = start; time <= end; time++) {
    highlights.push({ time, text: `${label}` })
  }
  return highlights
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ArtPlayer({ intro, outro, tracks, option, getInstance, artRef, className, ...rest }: any) {
  const artInstanceRef = useRef<Artplayer | null>(null)

  useEffect(() => {
    if (!artRef.current) return

    if (artInstanceRef.current) {
      artInstanceRef.current.destroy(true)
    }

    const trackOptions: Array<{ default: boolean; html: string; url: string }> = []

    tracks.map((track: { label: string; file: string; kind: string }) => {
      if (track.kind === "captions") {
        trackOptions.push({
          default: track.label === "English",
          html: track.label,
          url: track.file,
        })
      }
    })

    // Custom theme colors
    const primaryColor = "#10b981" // Emerald-500
    const bgColor = "rgba(0, 0, 0, 0.8)"
    const textColor = "#ffffff"

    // Quality options (use the ones from your video source or define custom ones)
    const qualityOptions = option.qualityOptions || [
      {
        default: true,
        html: "Auto",
        url: option.url,
      },
      {
        html: "1080p",
        url: option.url.replace(/\.[^.]+$/, "-1080p$&") || option.url,
      },
      {
        html: "720p",
        url: option.url.replace(/\.[^.]+$/, "-720p$&") || option.url,
      },
      {
        html: "480p",
        url: option.url.replace(/\.[^.]+$/, "-480p$&") || option.url,
      },
    ]

    const art = new Artplayer({
      ...option,
      container: artRef.current,
      highlight: [
        ...generateHighlights(intro?.start, intro?.end, "Intro"),
        ...generateHighlights(outro?.start, outro?.end, "Outro"),
      ],
      theme: primaryColor,
      backdrop: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      autoPlayback: true,
      airplay: true,
      fastForward: true,
      hotkey: true,
      pip: true,
      mutex: true,
      playsInline: true,
      autoSize: true,
      autoOrientation: true,
      settings: [
        {
          width: 280,
          html: '<span class="settings-icon">⚙️ Settings</span>',
          tooltip: "Settings",
          selector: [
            {
              html: '<span class="settings-item-title">Quality</span>',
              width: 280,
              tooltip: "Quality",
              selector: qualityOptions,
              onSelect: (item) => {
                art.switchQuality(item.url)
                return item.html
              },
            },
            {
              html: '<span class="settings-item-title">Subtitles</span>',
              width: 280,
              tooltip: "Subtitles",
              selector: [
                {
                  html: '<span class="settings-switch">Display</span>',
                  tooltip: "Show",
                  switch: true,
                  onSwitch: (item) => {
                    item.tooltip = item.switch ? "Hide" : "Show"
                    art.subtitle.show = !item.switch
                    return !item.switch
                  },
                },
                ...trackOptions.map((track) => ({
                  ...track,
                  html: `<span class="settings-option">${track.html}</span>`,
                })),
              ],
              onSelect: (item) => {
                if (item.url) {
                  art.subtitle.switch(item.url, {
                    name: item.html.replace(/<[^>]*>/g, ""),
                  })
                }
                return item.html
              },
            },
            {
              html: '<span class="settings-item-title">Playback Speed</span>',
              width: 280,
              tooltip: "Playback Speed",
              selector: [
                { html: '<span class="settings-option">0.5x</span>', value: 0.5 },
                { html: '<span class="settings-option">0.75x</span>', value: 0.75 },
                { html: '<span class="settings-option">Normal</span>', value: 1, default: true },
                { html: '<span class="settings-option">1.25x</span>', value: 1.25 },
                { html: '<span class="settings-option">1.5x</span>', value: 1.5 },
                { html: '<span class="settings-option">2x</span>', value: 2 },
              ],
              onSelect: (item) => {
                art.playbackRate = item.value
                return item.html
              },
            },
          ],
        },
      ],
      icons: {
        loading: `
        <div class="loading-spinner">
          <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" fill="none" stroke="${primaryColor}" strokeWidth="4" strokeDasharray="60 20">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
      `,
        state: `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
      `,
        pause: `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
        </svg>
      `,
      },
      customType: {
        ...option.customType,
      },
    })

    // Apply custom styles to the player
    art.cssVar("--art-theme", primaryColor)
    art.cssVar("--art-subtitle-color", textColor)
    art.cssVar("--art-subtitle-background-color", bgColor)
    art.cssVar("--art-subtitle-height", "15%")
    art.cssVar("--art-control-height", "50px")
    art.cssVar("--art-progress-height", "6px")

    // Custom styles for controls
    const style = document.createElement("style")
    style.textContent = `
    .art-video-player {
      --art-theme: ${primaryColor};
      --art-background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .art-video-player .art-control {
      border-radius: 0 0 0.5rem 0.5rem;
      backdrop-filter: blur(10px);
    }
    .art-video-player .art-control-progress {
      height: 6px;
      transition: height 0.2s ease;
    }
    .art-video-player:hover .art-control-progress {
      height: 8px;
    }
    .art-video-player .art-control-volume {
      border-radius: 1rem;
    }
    
    /* Improved Settings UI */
    .art-video-player .art-settings {
      border-radius: 8px;
      overflow: hidden;
    }
    .art-video-player .art-settings-panel {
      border-radius: 8px;
      backdrop-filter: blur(16px);
      background: rgba(17, 24, 39, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 0;
    }
    .art-video-player .art-settings-body {
      padding: 8px;
    }
    .art-video-player .art-settings-item {
      border-radius: 6px;
      transition: all 0.2s ease;
      margin: 4px 0;
      padding: 10px 16px;
      font-weight: 500;
    }
    .art-video-player .art-settings-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .art-video-player .art-settings-item.art-current {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }
    .art-video-player .art-settings-header {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
      color: #fff;
    }
    .art-video-player .art-settings-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .art-video-player .art-settings-icon svg {
      width: 20px;
      height: 20px;
    }
    .art-video-player .art-settings-item-title {
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
    }
    .art-video-player .art-settings-item-title::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .art-video-player .settings-icon {
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    .art-video-player .settings-item-title {
      font-weight: 600;
      color: #fff;
      display: block;
      padding: 4px 0;
    }
    .art-video-player .settings-option {
      padding: 4px 0;
      display: block;
    }
    .art-video-player .settings-switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .art-video-player .art-highlight {
      background: ${primaryColor};
      opacity: 0.8;
    }
    .art-video-player .art-highlight-text {
      background: ${bgColor};
      color: ${textColor};
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 500;
    }
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    /* Quality selector specific styles */
    .art-video-player .art-selector-list {
      max-height: 300px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    }
    .art-video-player .art-selector-list::-webkit-scrollbar {
      width: 4px;
    }
    .art-video-player .art-selector-list::-webkit-scrollbar-track {
      background: transparent;
    }
    .art-video-player .art-selector-list::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
  `
    document.head.appendChild(style)

    artInstanceRef.current = art

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: Math.max(14, art.height * 0.04) + "px",
        bottom: "10%",
        fontWeight: "500",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
      })
    })

    if (getInstance && typeof getInstance === "function") {
      getInstance(art)
    }

    return () => {
      if (artInstanceRef.current) {
        art.destroy(true)
        document.head.removeChild(style)
      }
    }
    //eslint-disable-next-line
  }, [option, intro, outro, tracks, artRef, getInstance])

  return (
    <div
      ref={artRef}
      {...rest}
      className={cn("w-full aspect-video bg-transparent rounded-lg", className)}
      style={{ background: "none" }}
    />
  )
}
/* eslint-disable @typescript-eslint/no-explicit-any */

export default ArtPlayer

