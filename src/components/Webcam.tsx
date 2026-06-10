import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Bitsy from './Bitsy';
import Button from './ui/Button';
import { videoFrameToExampleDataUrl } from '../lib/image';

interface WebcamProps {
  bucketName: string;
  onCapture: (src: string) => void;
  onClose: () => void;
}

type Phase = 'explain' | 'requesting' | 'live' | 'denied';

/**
 * Full-screen webcam capture modal. Shows a kid-readable explainer BEFORE asking
 * for camera permission (privacy-first). The stream is local only — never
 * recorded or sent anywhere — and all tracks stop when the modal closes.
 */
export default function Webcam({ bucketName, onCapture, onClose }: WebcamProps) {
  const [phase, setPhase] = useState<Phase>('explain');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startCamera() {
    setPhase('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setPhase('live');
    } catch {
      setPhase('denied');
    }
  }

  // Attach the stream once the <video> is mounted in the "live" phase.
  useEffect(() => {
    if (phase === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play();
    }
  }, [phase]);

  // Always release the camera when the modal unmounts.
  useEffect(() => stopStream, []);

  function close() {
    stopStream();
    onClose();
  }

  function snap() {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      onCapture(videoFrameToExampleDataUrl(videoRef.current));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Take ${bucketName} photos with your camera`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-[var(--radius-chunky)] border-4 border-ink bg-paper p-5 shadow-hard-lg"
      >
        {phase === 'explain' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Bitsy mood="curious" size={110} />
            <h2 className="font-display text-2xl font-bold">Can I use the camera?</h2>
            <p className="font-body text-ink/80">
              Your camera helps me see pictures for the <strong>{bucketName}</strong> bucket. The
              pictures stay on <strong>your device</strong> — nothing is ever sent to the internet. 🔒
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={close}>
                Maybe later
              </Button>
              <Button variant="mint" size="sm" onClick={() => void startCamera()}>
                Turn on camera 📸
              </Button>
            </div>
          </div>
        )}

        {phase === 'requesting' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Bitsy mood="thinking" size={110} />
            <p className="font-display font-semibold">Waiting for the camera…</p>
          </div>
        )}

        {phase === 'live' && (
          <div className="flex flex-col items-center gap-4">
            <div className="overflow-hidden rounded-2xl border-4 border-ink">
              {/* Mirror the preview so it feels like a mirror to the child. */}
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-64 w-64 -scale-x-100 object-cover"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={close}>
                Done
              </Button>
              <button
                onClick={snap}
                aria-label={`Take a ${bucketName} photo`}
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-ink bg-coral text-2xl shadow-hard transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                <span aria-hidden>📸</span>
              </button>
            </div>
          </div>
        )}

        {phase === 'denied' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Bitsy mood="confused" size={110} />
            <h2 className="font-display text-xl font-bold">No camera — that's okay!</h2>
            <p className="font-body text-ink/80">
              You can still add pictures by dropping image files instead.
            </p>
            <Button variant="blue" size="sm" onClick={close}>
              Got it
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
