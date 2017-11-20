var audioContext = null;
var meter = null;
var rafID = null;


const ptypoFactory = new Ptypo.default();
const volumeFont = [];
ptypoFactory.createFont('lyricFont', Ptypo.templateNames.GROTESK).then(function(font) {
    font.changeParams({thickness: 70, spacing: 0.5});

    volumeFont.push({
        changeVolume: function() {
            // console.log(meter.volume*1000);
            font.changeParams({'width': meter.volume*100});
        }
    });
});

window.onload = function() {

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    window.setInterval(getVolumeAndChangeFont, 100);

};

function getVolumeAndChangeFont() {

    volumeFont.forEach(function(toggle) {
        toggle['changeVolume']();

    });
    // rafID = window.requestAnimationFrame( getVolumeAndChangeFont );

};