var lastPlayed, count = 0, audio, audioCopy, loopCondition = 0

const play = document.querySelector(".play")
const pause = document.querySelector(".pause")
const stop = document.querySelector(".stop")
const loop = document.querySelector(".loopIcon")
const replay = document.querySelector(".replay")

const controller = document.querySelector(".controller")
const backgroundBar = document.querySelector(".backgroundBar")
const playBar = document.querySelector(".playBar")
const playTime = document.querySelector(".playTime")
const endTime = document.querySelector(".endTime")

var timeManager

var animationId

window.addEventListener("keydown", function (e) {
    count++
    if(count == 1)
        firstTime(e)
    else
        laterOn(e)
})

function firstTime(e) {
    audioCopy = document.querySelector(`audio[data-key="${e.key}"]`)
    if(!audioCopy) 
    {
        count = 0
        return;
    }

    audio = audioCopy

    audio.currentTime = "0"
    audio.play()
    playBarAnimation()

    play.style.display = "none"
    replay.style.display = "none"
    pause.style.display = "inline"
    lastPlayed = e.key
    controller.classList.add("controllerOnStart")
}

function laterOn(e) {
    audioCopy = document.querySelector(`audio[data-key="${e.key}"]`)
    if(!audioCopy) 
        return;

    audio = audioCopy

    if (e.key == lastPlayed)
    {
        if(audio.paused)
            {
                audio.play()

                play.style.display = "none"
                replay.style.display = "none"
                pause.style.display = "inline"
            }
        else
            {
                audio.pause()
                clearTimeout(timeManager)
                pause.style.display = "none"
                replay.style.display = "none"
                play.style.display = "inline"
            }
    }
    else
    {
        clearTimeout(timeManager)
        document.querySelector(`audio[data-key="${lastPlayed}"]`).pause()
        audio.currentTime = "0"
        audio.play()
        
        pause.style.display = "inline"
        replay.style.display = "none"
        play.style.display = "none"
    }
    
    lastPlayed = e.key
}

function playBtn() {
    audio.play()
    play.style.display = "none"
    pause.style.display = "inline"
}

function pauseBtn() {
    audio.pause()
    clearTimeout(timeManager)
    pause.style.display = "none"
    play.style.display = "inline"
}

function switchToReplay() {
    play.style.display = "none"
    pause.style.display = "none"
    replay.style.display = "inline"
}

function replayBtn() {
    audio.currentTime = "0"
    pause.style.display = "inline"
    play.style.display = "none"
    replay.style.display = "none"
    audio.play()
}
 
function loopBtn() {
    if (!loopCondition)
    {
        loopCondition = 1
        loop.style.color = "rgb(123, 255, 0)"
    }   
    else
    {
        loopCondition = 0
        loop.style.color = "ivory"
    }
}

function stopBtn() {
    audio.pause()

    clearInterval(animationId)
    audio = null

    count = 0

    controller.classList.add("controllerOnEnd")

    setTimeout(function() {
        controller.classList.remove("controllerOnStart")
        controller.classList.remove("controllerOnEnd")
    }, 1000)
}

function playBarAnimation() {
    var currentTime, totalTime, timeCount = 0, audioBackup = audio

    animationId = setInterval(animation, 10)

    function animation() {
        currentTime = audio.currentTime
        totalTime = audio.duration
        var playBarPos = (100 - (currentTime * 100 / totalTime)) + "%"
        playBar.style.transform = `translate(-${playBarPos})`
        
        if (audio == audioBackup)
        {
            if (timeCount % 100 == 0) 
            {
                playTime.innerHTML = minCalculator(currentTime)
            }

            timeCount += 1
        }
        else 
        {
            playTime.innerHTML = minCalculator(currentTime)
            timeCount = 0
        }

        endTime.innerHTML = minCalculator(totalTime)

        audioBackup = audio

        if(audio.paused)
        {
            pause.style.display = "none"
            play.style.display = "inline"
            replay.style.display = "none"
        }
        else
        {
            pause.style.display = "inline"
            play.style.display = "none"
            replay.style.display = "none"
        }

        if(loopCondition == 1)
        {
            if (audio.ended)
            {
                audio.currentTime = "0"
                audio.play()
            }
        }
        else
        {
            if (audio.ended)
            {
                switchToReplay() 
            }
        }
    }
}

function minCalculator(t) {
    var timeSec = Math.floor(t)
    var timeMin = Math.floor(timeSec / 60)
    timeSec = timeSec % 60
    timeSec = `${timeSec}`
    timeMin = `${timeMin}`
    timeSec = timeSec.padStart(2, "0")
    timeMin = timeMin.padStart(2, "0")
    return timeMin + " : " + timeSec
}