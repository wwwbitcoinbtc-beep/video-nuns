import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, RotateCw, ShieldCheck, X, AlertTriangle, 
  Lock, Settings, EyeOff, Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoPlayer: React.FC = () => {
  const { 
    activeVideoMovie, 
    activeVideoMode, 
    closePlayer, 
    triggerDrmWarning 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [watermarkSeed] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = activeVideoMode === 'trailer' 
    ? activeVideoMovie?.trailerUrl 
    : activeVideoMovie?.videoUrl;

  // Anti-download keyboard shortcut shields (Ctrl+S, Cmd+S, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerDrmWarning(
          '⛔ Direct download and saving is prohibited by Widevine L1 DRM protocol.'
        );
      }
      if (e.key === 'Escape' && isFullscreen) {
        handleExitFullscreen();
      }
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, triggerDrmWarning]);

  // Controls auto-hide
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const total = videoRef.current.duration || 1;
      setBufferedPercent((bufferedEnd / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.volume = volume;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    resetControlsTimer();
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    resetControlsTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
    resetControlsTimer();
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeVideoMovie) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        triggerDrmWarning();
      }}
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
    >
      {/* Top Overlay Banner with DRM Badge & Close */}
      <div 
        className={`absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={closePlayer}
            className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
              {activeVideoMovie.title}
              {activeVideoMode === 'trailer' && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  Trailer Preview
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span className="text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Encrypted DRM Stream
              </span>
              <span>•</span>
              <span className="text-rose-400 flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Download Disabled
              </span>
            </div>
          </div>
        </div>

        {/* Security watermark badge pill */}
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[11px] text-neutral-400">UID: VN-{watermarkSeed}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* HTML5 Video with strictly disabled native controls & nodownload attribute */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain pointer-events-none"
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* Transparent Click Shield */}
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlayPause}
          onContextMenu={(e) => {
            e.preventDefault();
            triggerDrmWarning();
          }}
          onDoubleClick={toggleFullscreen}
        />

        {/* Dynamic Shifting Anti-Piracy Watermark */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="animate-watermark inline-flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-xs rounded border border-white/10 text-white/40 text-[10px] md:text-xs font-mono tracking-widest uppercase">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>VN-AUTH:{watermarkSeed} • NO DOWNLOAD</span>
          </div>
        </div>

        {/* Buffering Spinner */}
        {isBuffering && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          </div>
        )}

        {/* Big Center Play/Pause Indicator on tap */}
        {!isPlaying && !isBuffering && (
          <div 
            onClick={togglePlayPause}
            className="absolute z-20 w-20 h-20 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-2xl backdrop-blur-sm"
          >
            <Play className="w-10 h-10 fill-white text-white translate-x-0.5" />
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (Touch-Friendly) */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="relative mb-3 flex items-center group">
          <div className="absolute inset-x-0 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-700/60 transition-all duration-300" 
              style={{ width: `${bufferedPercent}%` }}
            />
          </div>
          <div 
            className="absolute left-0 top-0 h-1.5 bg-amber-500 rounded-full pointer-events-none"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-3 opacity-0 cursor-pointer z-10"
            title="Seek timeline"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
            </button>

            <button
              onClick={() => skipSeconds(-10)}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipSeconds(10)}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Timestamps */}
            <div className="text-xs text-neutral-300 font-mono flex items-center gap-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-neutral-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Resolution Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/90 border border-neutral-700/80 rounded-md flex items-center gap-1.5 hover:border-neutral-500 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>{selectedQuality}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-neutral-900/95 border border-neutral-700 rounded-lg shadow-2xl p-1 z-40 backdrop-blur-md">
                  {['4K Ultra HD', '1080p', '720p', '480p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between ${
                        selectedQuality === q 
                          ? 'bg-amber-500/20 text-amber-400 font-semibold' 
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Anti-download indicator button */}
            <button
              onClick={() => triggerDrmWarning()}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-md hover:bg-emerald-900/40 transition-colors"
              title="Stream Security Info"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Download</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
