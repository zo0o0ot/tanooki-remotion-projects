/**
 * Remotion config — optimized for ThinkPad P15 / Linux / DaVinci Resolve output
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import os from "os";

// ---------------------------------------------------------------------------
// Performance: use all CPU threads for parallel rendering
// ---------------------------------------------------------------------------
Config.setConcurrency(os.cpus().length);

// On Linux, Remotion defaults to --single-process for Chromium. Disabling that
// allows multi-process rendering which is significantly faster on the P15.
Config.setChromiumMultiProcessOnLinux(true);

// ---------------------------------------------------------------------------
// GPU acceleration
// ---------------------------------------------------------------------------
// Use the Vulkan backend for Chromium — best option for NVIDIA on Linux.
// If you hit instability, fall back to "egl" (EGL/OpenGL) or "angle".
Config.setChromiumOpenGlRenderer("vulkan");

// Tell FFmpeg's decode path to use hardware acceleration if available.
Config.setHardwareAcceleration("if-possible");

// ---------------------------------------------------------------------------
// Chrome for Testing (recommended over headless-shell for GPU flags)
// ---------------------------------------------------------------------------
// Run `npx remotion browser ensure` to download the browser.
// Then run `npx remotion browser whereis` to find the exact path and
// uncomment the line below.
//
// Config.setBrowserExecutable("/path/to/chrome-for-testing");
Config.setChromeMode("chrome-for-testing");

// ---------------------------------------------------------------------------
// DaVinci Resolve: ProRes 4444 with alpha
// ---------------------------------------------------------------------------
// ProRes 4444 with 10-bit YUVA — preserves full alpha in Resolve.
// Render command: npx remotion render <entry> <CompositionId> --codec prores
Config.setCodec("prores");
Config.setProResProfile("4444");
Config.setPixelFormat("yuva444p10le");

// PNG intermediate frames are required for alpha to survive the encode.
Config.setVideoImageFormat("png");

// ---------------------------------------------------------------------------
// General
// ---------------------------------------------------------------------------
Config.setOverwriteOutput(true);
