window.onload = () => {

// get reference to the stage
const vCanvas = document.getElementById('videoOut');
const c = vCanvas.getContext('2d');

//load video
const v = document.createElement('video');

v.src = './assets/video/video2.mp4';
v.autoplay = true;
v.loop = true;

let frameCount = 0;

v.addEventListener('play', (event)=>{
    //process video  
    function resizeWindow(){
        vCanvas.width = v.videoWidth;
        vCanvas.height = v.videoHeight;
    }
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    
    function animate(){
        frameCount++;
        if(frameCount % 1000 == 0){
            //draw it to canvas
            c.drawImage(v, 0, 0);

            const imageData = c.getImageData(0, 0, vCanvas.width, vCanvas.height);
            let imageArray = [];
            //where there is a pixel, put an object
            let xArrayOffset = 0;
            for(let y = 0; y < imageData.height; y++){
                let xOfPixel = 0;
                xArrayOffset += imageData.width * 4;
                for(let x = 0; x < imageData.width * 4; x += 4){

                    let pixel = {};
                    
                    pixel.r = imageData.data[x + xArrayOffset];
                    pixel.g = imageData.data[x + 1 + xArrayOffset];
                    pixel.b = imageData.data[x + 2 + xArrayOffset];
                    pixel.a = imageData.data[x + 3 + xArrayOffset];

                    pixel.x = xOfPixel++;
                    pixel.y = y;
                    
                    imageArray.push(pixel);
                }
            }

            c.clearRect(0,0,vCanvas.width, vCanvas.height);
            
            //where there is an object, put a circle
            var circleSize = 1;
            imageArray.forEach((p, index, wholeArray) => {
                if(index % (circleSize * 2) == 0){
                    if(p.y % (circleSize * 2) == 0){
                        if(p.a != 0){
                            c.strokeStyle = `rgba(${p.r + 50}, ${p.g + 50}, ${p.b + 50}, ${255 - p.r + 255 - p.g + 255 - p.b})`;
                            c.fillStyle = `rgba(${p.r + 50}, ${p.g + 50}, ${p.b + 50}, ${255 - p.r + 255 - p.g + 255 - p.b})`;
                            c.lineWidth = circleSize/5;
                            c.beginPath();
                            c.fillRect(
                                p.x, 
                                p.y, 
                                circleSize,
                                circleSize
                                );
                            //c.stroke();
                            c.closePath();
                        }
                    }
                }
            });
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    document.body.appendChild(vCanvas);
});

};