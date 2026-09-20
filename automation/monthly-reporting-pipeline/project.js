const workflowVideo = document.querySelector('[data-workflow-video] video');
const videoChapters = [...document.querySelectorAll('[data-video-time]')];
const videoFrame = document.querySelector('.videoFrame');
const videoPlay = document.querySelector('[data-video-play]');
const nativeSeek = document.querySelector('[data-native-seek]');
let isNativeSeeking = false;
let resumeAfterNativeSeek = false;
let localVideoBlobUrl = null;
let localVideoBlobPromise = null;

async function ensureLocallySeekableVideo() {
  if (!workflowVideo || !['127.0.0.1', 'localhost'].includes(window.location.hostname)) return;
  if (localVideoBlobUrl) return;
  if (!localVideoBlobPromise) {
    const source = workflowVideo.querySelector('source')?.src || workflowVideo.currentSrc;
    localVideoBlobPromise = fetch(source)
      .then((response) => {
        if (!response.ok) throw new Error(`Video request failed: ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        localVideoBlobUrl = URL.createObjectURL(blob);
        workflowVideo.src = localVideoBlobUrl;
        workflowVideo.load();
        return new Promise((resolve) => {
          if (workflowVideo.readyState >= 1) resolve();
          else workflowVideo.addEventListener('loadedmetadata', resolve, { once: true });
        });
      })
      .catch(() => {});
  }
  await localVideoBlobPromise;
}

function syncNativeSeek() {
  if (!workflowVideo || !nativeSeek) return;
  if (Number.isFinite(workflowVideo.duration)) nativeSeek.max = String(workflowVideo.duration);
  if (!isNativeSeeking) nativeSeek.value = String(workflowVideo.currentTime || 0);
}

function queueWorkflowStart(startTime) {
  if (!workflowVideo || startTime == null) return;
  const applyStartTime = () => {
    workflowVideo.currentTime = Math.min(workflowVideo.duration || startTime, Math.max(0, startTime));
    workflowVideo.dispatchEvent(new Event('timeupdate'));
  };
  if (workflowVideo.readyState >= 1) applyStartTime();
  else workflowVideo.addEventListener('loadedmetadata', applyStartTime, { once: true });
}

async function playWorkflowVideo(startTime = null) {
  if (!workflowVideo) return;
  workflowVideo.controls = true;
  videoFrame?.classList.add('isLoading');
  if (videoPlay) videoPlay.disabled = true;
  await ensureLocallySeekableVideo();
  queueWorkflowStart(startTime);
  if (workflowVideo.readyState === 0) workflowVideo.load();
  try {
    await workflowVideo.play();
  } catch (error) {
    videoFrame?.classList.remove('isLoading');
    if (videoPlay) videoPlay.disabled = false;
  }
}

function seekVideo(seconds) {
  if (!workflowVideo || !Number.isFinite(workflowVideo.duration)) return;
  workflowVideo.currentTime = Math.min(workflowVideo.duration, Math.max(0, workflowVideo.currentTime + seconds));
  workflowVideo.dispatchEvent(new Event('timeupdate'));
}

videoChapters.forEach((chapter) => {
  chapter.addEventListener('click', () => {
    if (!workflowVideo) return;
    playWorkflowVideo(Number(chapter.dataset.videoTime) || 0);
  });
});

videoPlay?.addEventListener('click', () => {
  playWorkflowVideo();
});

workflowVideo?.addEventListener('playing', () => {
  videoFrame?.classList.remove('isLoading');
  videoFrame?.classList.add('hasStarted');
  syncNativeSeek();
});

workflowVideo?.addEventListener('waiting', () => {
  videoFrame?.classList.add('isLoading');
});

workflowVideo?.addEventListener('error', () => {
  videoFrame?.classList.remove('isLoading');
  if (videoPlay) videoPlay.disabled = false;
});

workflowVideo?.addEventListener('ended', () => {
  videoFrame?.classList.remove('hasStarted');
  videoFrame?.classList.remove('isLoading');
  if (videoPlay) videoPlay.disabled = false;
});

workflowVideo?.addEventListener('loadedmetadata', syncNativeSeek);

nativeSeek?.addEventListener('pointerdown', () => {
  if (!workflowVideo) return;
  isNativeSeeking = true;
  resumeAfterNativeSeek = !workflowVideo.paused;
  workflowVideo.pause();
});

nativeSeek?.addEventListener('input', () => {
  if (!workflowVideo) return;
  workflowVideo.currentTime = Number(nativeSeek.value);
});

function finishNativeSeek() {
  if (!isNativeSeeking || !workflowVideo || !nativeSeek) return;
  workflowVideo.currentTime = Number(nativeSeek.value);
  isNativeSeeking = false;
  syncNativeSeek();
  if (resumeAfterNativeSeek) workflowVideo.play().catch(() => {});
  resumeAfterNativeSeek = false;
}

document.addEventListener('pointerup', finishNativeSeek);
document.addEventListener('pointercancel', finishNativeSeek);

let videoFrameHovered = false;
videoFrame?.addEventListener('mouseenter', () => { videoFrameHovered = true; });
videoFrame?.addEventListener('mouseleave', () => { videoFrameHovered = false; });

document.addEventListener('keydown', (event) => {
  if (!workflowVideo || (!videoFrameHovered && !videoFrame?.contains(document.activeElement))) return;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  seekVideo(event.key === 'ArrowLeft' ? -10 : 10);
}, true);

workflowVideo?.addEventListener('timeupdate', () => {
  syncNativeSeek();
  let activeChapter = videoChapters[0];
  videoChapters.forEach((chapter) => {
    if (workflowVideo.currentTime >= Number(chapter.dataset.videoTime)) activeChapter = chapter;
  });
  videoChapters.forEach((chapter) => chapter.classList.toggle('isActive', chapter === activeChapter));
});

window.addEventListener('beforeunload', () => {
  if (localVideoBlobUrl) URL.revokeObjectURL(localVideoBlobUrl);
});
