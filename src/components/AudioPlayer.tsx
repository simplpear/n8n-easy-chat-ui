import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { Attachment } from '../types';

interface AudioPlayerProps {
  attachment: Attachment;
  onDownloadAttachment: (attachment: Attachment) => void;
  audioElements: {
    [key: string]: HTMLAudioElement;
  };
  playingAudio: string | null;
  setPlayingAudio: (id: string | null) => void;
  setAudioElements: React.Dispatch<React.SetStateAction<{
    [key: string]: HTMLAudioElement;
  }>>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  attachment,
  onDownloadAttachment,
  audioElements,
  playingAudio,
  setPlayingAudio,
  setAudioElements
}) => {
  const attachmentId = attachment.id || 'attachment_no_id'; // Ensure ID for logging
  const isPlaying = playingAudio === attachmentId;
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // console.log(`[AudioPlayer ${attachmentId}] Mounted or attachmentId changed.`);
    return () => {
      // console.log(`[AudioPlayer ${attachmentId}] Unmounting. Clearing transition.`);
      setIsTransitioning(false); 
    };
  }, []); 
  
  const toggleAudioPlayback = async () => {
    console.log(`[AudioPlayer ${attachmentId}] toggleAudioPlayback called. isPlaying: ${isPlaying}, isTransitioning: ${isTransitioning}`);
    if (isTransitioning) {
      console.log(`[AudioPlayer ${attachmentId}] Aborting: isTransitioning is true.`);
      return;
    }

    let audio = audioElements[attachmentId];

    if (!audio) {
      console.log(`[AudioPlayer ${attachmentId}] No existing audio element. Creating new one.`);
      const url = attachment.url || (attachment.data ? URL.createObjectURL(attachment.data) : '');
      if (!url) {
        console.error(`[AudioPlayer ${attachmentId}] No audio URL available for playback.`);
        return;
      }
      
      audio = new Audio(url);
      console.log(`[AudioPlayer ${attachmentId}] New Audio object created with URL: ${url.substring(0,100)}`);
      audio.load();
      audio.addEventListener('ended', () => {
        console.log(`[AudioPlayer ${attachmentId}] 'ended' event fired. CurrentTime: ${audio?.currentTime}, Duration: ${audio?.duration}, PausedStateOnEnd: ${audio?.paused}`);
        console.log(`[AudioPlayer ${attachmentId}] Calling setPlayingAudio(null) due to 'ended' event.`);
        setPlayingAudio(null); // Directly set to null as this instance has ended.
        if (audio) audio.currentTime = 0; 
      });
      audio.addEventListener('error', (e) => {
        console.error(`[AudioPlayer ${attachmentId}] 'error' event fired. Error code: ${audio?.error?.code}, Message: ${audio?.error?.message}`, e);
        setPlayingAudio(null); // Stop playback on error
        setIsTransitioning(false);
      });
      setAudioElements(prev => ({ ...prev, [attachmentId]: audio }));
      
      console.log(`[AudioPlayer ${attachmentId}] Setting isTransitioning = true before new play.`);
      setIsTransitioning(true);
      try {
        console.log(`[AudioPlayer ${attachmentId}] Attempting audio.play() for new audio.`);
        await audio.play();
        console.log(`[AudioPlayer ${attachmentId}] audio.play() succeeded. Setting playingAudio to ${attachmentId}.`);
        setPlayingAudio(attachmentId);
      } catch (err) {
        console.error(`[AudioPlayer ${attachmentId}] Error playing new audio:`, err);
        setPlayingAudio(null);
      } finally {
        console.log(`[AudioPlayer ${attachmentId}] New play finally block. Setting isTransitioning = false.`);
        setIsTransitioning(false);
      }
      return;
    }

    // Audio element exists
    console.log(`[AudioPlayer ${attachmentId}] Existing audio element found.`);
    if (playingAudio === attachmentId) { // Currently playing, user wants to stop
      console.log(`[AudioPlayer ${attachmentId}] Audio is playing. Attempting to stop.`);
      console.log(`[AudioPlayer ${attachmentId}] Setting isTransitioning = true before stop.`);
      setIsTransitioning(true);
      audio.pause();
      audio.currentTime = 0; 
      console.log(`[AudioPlayer ${attachmentId}] Paused and reset time. Setting playingAudio = null.`);
      setPlayingAudio(null);
      console.log(`[AudioPlayer ${attachmentId}] Stop complete. Setting isTransitioning = false.`);
      setIsTransitioning(false); 
    } else { // Was paused, or another audio was playing; user wants to play this one
      console.log(`[AudioPlayer ${attachmentId}] Audio is not playing this attachment. Attempting to play.`);
      if (playingAudio && audioElements[playingAudio] && audioElements[playingAudio] !== audio) {
        console.log(`[AudioPlayer ${attachmentId}] Pausing other audio: ${playingAudio}`);
        audioElements[playingAudio].pause();
      }

      if (audio.ended || audio.currentTime === 0) { 
        console.log(`[AudioPlayer ${attachmentId}] Resetting currentTime to 0 before play.`);
        audio.currentTime = 0;
      }

      console.log(`[AudioPlayer ${attachmentId}] Setting isTransitioning = true before existing play.`);
      setIsTransitioning(true);
      try {
        console.log(`[AudioPlayer ${attachmentId}] Attempting audio.play() for existing audio.`);
        await audio.play();
        console.log(`[AudioPlayer ${attachmentId}] audio.play() succeeded. Setting playingAudio to ${attachmentId}.`);
        setPlayingAudio(attachmentId);
      } catch (err) {
        console.error(`[AudioPlayer ${attachmentId}] Error playing existing audio:`, err);
        setPlayingAudio(null); 
      } finally {
        console.log(`[AudioPlayer ${attachmentId}] Existing play finally block. Setting isTransitioning = false.`);
        setIsTransitioning(false);
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center bg-opacity-30 bg-transparent py-2 px-2 max-w-xs">
      <button 
        onClick={toggleAudioPlayback} 
        disabled={isTransitioning}
        className={`p-2 flex items-center justify-center rounded-full flex-shrink-0 mr-3 text-white ${
          isPlaying 
            ? 'bg-chat-accent'  // Active playing/stop state uses accent color
            : 'bg-white/[0.17]' // Idle state color
        } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isPlaying ? 'Stop voice message' : 'Play voice message'}
        style={{ width: '36px', height: '36px' }} // Ensure consistent size for circle
      >
        {isPlaying ? (
          <Square size={14} /> // Only Stop icon
        ) : (
          <Play size={14} /> // Only Play icon
        )}
      </button>
      
      <div className={`text-sm truncate`}>
        {attachment.source === 'microphone' 
          ? 'Voice message' 
          : (attachment.name || 'Audio File')}
      </div>
    </div>
  );
};

export default AudioPlayer;
