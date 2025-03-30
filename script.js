
      const audioPlayer = document.getElementById("audioPlayer");
      const volumeControl = document.getElementById("volume");
      const canvas = document.getElementById("visualizer");
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audioPlayer);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 1.5;
          ctx.fillStyle = `rgba(${barHeight + 100}, 50, 250, 0.8)`;
          ctx.shadowBlur = 40;
          ctx.shadowColor = `rgb(${barHeight + 100}, 50, 250)`;
          ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
          x += barWidth + 2;
        }
      }
            document.addEventListener("dblclick", (event) => {
        if (!event.target.closest(".player-container")) {
          if (audioPlayer.paused) {
            audioPlayer.play();
            if (audioCtx.state === "suspended") {
              audioCtx.resume();
            }
            drawVisualizer();
          } else {
            audioPlayer.pause();
          }
        }
      });

      volumeControl.addEventListener("input", () => {
        audioPlayer.volume = volumeControl.value;
      });
    
