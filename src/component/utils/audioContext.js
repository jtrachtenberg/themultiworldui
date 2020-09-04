import { AudioContext, decodeAudioData } from 'standardized-audio-context';
import {isSafari} from 'react-device-detect'

export const audioContext = (URL) => {
    
    //window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();
    //const nativeAudioContext = new webkitAudioContextContext();
  
    let audioBuffer;
  
    window.fetch(URL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        if (isSafari) decodeAudioData(context, arrayBuffer);
        else context.decodeAudioData(arrayBuffer)
      })
      .then(inaudioBuffer => {
        audioBuffer = inaudioBuffer;
        play(audioBuffer)
      });
        
    function play(audioBuffer) {
        console.log('playing')
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      context.resume()
    }
  }

  /**
   * import { decodeAudioData } from 'standardized-audio-context';

// Let's imagine you run this in Safari.
const nativeAudioContext = new webkitAudioContextContext();

const response = await fetch('/a-super-cool-audio-file');
const arrayBuffer = await response.arrayBuffer();

const audioBuffer = await decodeAudioData(nativeAudioContext, arrayBuffer);
   */