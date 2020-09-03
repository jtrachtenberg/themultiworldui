export const audioContext = (URL) => {
        
    const context = new AudioContext();
      
    let audioBuffer;
  
    window.fetch(URL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(inaudioBuffer => {
        audioBuffer = inaudioBuffer;
        play(audioBuffer)
      });
        
    function play(audioBuffer) {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      context.resume()
    }
  }