function run(canvas, obj) {

    obj = obj || {}
    this.canvas = canvas
    this.cvs = canvas.getContext("2d")
    this.bgColor = obj.bgColor || "#e8e8e8"
    this.clickedColor = obj.clickedColor || "#ff0033"
    this.boxSize = obj.boxSize || 30
    this.bgWidthLength = 0
    this.bgHeightLength = 0
    this.clickedArr = []
    this.start()
    this.click()
    this.pencolornow = 1;
    return this
}
dappAddress="n1n8iVULbPu4NMpLVsegspJMxt9RZ8SkVRT"
run.prototype.start = function() {

    this.bgWidthLength = parseInt(this.canvas.width / this.boxSize)
    this.bgHeightLength = parseInt(this.canvas.height / this.boxSize)
    this.drawBg()

}
run.prototype.click = function() {
    
    let move = this.mousemove.bind(this)
    this.canvas.addEventListener("mousedown", function(e) {
 
        let o = this.computedXY(e.offsetX, e.offsetY,this.pencolornow)
        this.toggleClick(o)
        this.canvas.addEventListener("mousemove", move)

    }.bind(this))

    this.canvas.addEventListener("mouseup", function(e) {
        this.canvas.removeEventListener("mousemove", move)
    }.bind(this))
}
run.prototype.mousemove = function(e) {
    console.log(e.offsetX, e.offsetY)
    let o = this.computedXY(e.offsetX, e.offsetY,this.pencolornow)
    this.toggleClick(o, true)
}
run.prototype.computedXY = function(x, y, z) {

    for (let i = 0; i < this.bgWidthLength; i++) {
        if (x > i * this.boxSize && x < (i + 1) * this.boxSize) {
            x = i
            break;
        }
    }
    for (let i = 0; i < this.bgHeightLength; i++) {
        if (y > i * this.boxSize && y < (i + 1) * this.boxSize) {
            y = i
            break;
        }
    }
    z = this.pencolornow;
    return {
        x,
        y,
        z
    }
}
run.prototype.toggleClick = function(o, draw) {
    let has = {}
    has.is = true

    this.clickedArr.forEach(function(item, index) {

        if (item.x === o.x && item.y === o.y) {
            has.is = false
            has.index = index
        }
    })

    if (has.is) {
        this.clickedArr.push(o)
            this.drawBgBox(o.x * this.boxSize, o.y * this.boxSize, true)
        }
    if (!has.is && !draw) {
        if(o.x<20 && o.y<20){
        this.clickedArr.splice(has.index, 1)
        this.clickedArr.push(o)
        this.drawBgBox(o.x * this.boxSize, o.y * this.boxSize, true)
        }
        }

}
run.prototype.save = function(length) {
    console.log(savetext.value);
    var saveP = "";
    this.clickedArr.forEach(function(o, index) {
                            saveP = saveP +index +":"+ o.x+","+ o.y+","+o.z+"|";
                            console.log("X:",o.x, "Y:", o.y, "pencolor:",o.z);
                            //this.drawBgBox(o.x * this.boxSize, o.y * this.boxSize)
                            });

    console.log("********* call smart contract \"sendTransaction\" *****************")
    var func = "save"
    var args = "[\"" + savetext.value + "\",\"" +saveP + "\"]"
    console.log(args);
    
    var dappAddress = "n1n8iVULbPu4NMpLVsegspJMxt9RZ8SkVRT";
    window.postMessage({
                       "target": "contentscript",
                       "data":{
                       "to" : dappAddress,
                       "value" : "0.01",
                       "contract" : {
                       "function" : func,
                       "args" : args
                       }
                       },
                       "method": "neb_sendTransaction"
                       }, "*");
  
    
    /*
    for (let i = 0; i < length; i++) {
        let o = {}
        o.x = parseInt(Math.random() * this.bgWidthLength)
        o.y = parseInt(Math.random() * this.bgHeightLength)
        this.toggleClick(o)
    }*/
}

run.prototype.Read = function() {
    console.log(readtext.value);
    console.log("********* call smart contract by \"call\" *****************")
    var func = "get"
    console.log(readtext.value);
    var args = "[\"" + readtext.value + "\"]"
    
    window.postMessage({
                       "target": "contentscript",
                       "data":{
                       "to" : dappAddress,
                       "value" : "0",
                       "contract" : {
                       "function" : func,
                       "args" : args
                       }
                       },
                       "method": "neb_call"
                       }, "*");

}

run.prototype.clean = function() {

    this.clickedArr.forEach(function(o, index) {
                            console.log("X:",o.x, "Y:", o.y, "pencolor:",o.z);
        this.drawBgBox(o.x * this.boxSize, o.y * this.boxSize)
    }.bind(this))

    this.clickedArr = []
}

run.prototype.setpenColor = function(pencolor,pencolorint) {
    this.clickedColor=pencolor;
    this.pencolornow=pencolorint;
}
run.prototype.drawBg = function() {

    for (let i = 0; i < this.bgHeightLength; i++) {
        for (let j = 0; j < this.bgWidthLength; j++) {
            this.drawBgBox(j * this.boxSize, i * this.boxSize)
        }
    }
}
run.prototype.drawBgBox = function(x, y, z) {

    this.cvs.beginPath()
    this.cvs.fillStyle = z ? this.clickedColor : this.bgColor;
    this.cvs.fillRect(x + 1, y + 1, this.boxSize - 1, this.boxSize - 1);
    this.cvs.fill()
    this.cvs.stroke()
    this.cvs.closePath()
}

let canvas = document.querySelector(".main canvas")
let cvs = canvas.getContext("2d")
let a = new run(canvas);

let clean = document.querySelector(".clean");
let pencolor = document.querySelector(".pencolor");
let save = document.querySelector(".save");
let down = document.querySelector(".down");
let read = document.querySelector(".read");
let savetext = document.querySelector(".savetext")
let readtext = document.querySelector(".readtext")
pencolor.onchange = function() {
   
    if(pencolor.value == 1){
        colorchanged = "#ff0033"
    }else if(pencolor.value == 2){
        colorchanged = "#ff9900"
    }else if(pencolor.value == 3){
        colorchanged = "#ffff99"
    }else if(pencolor.value == 4){
        colorchanged = "#66ff66"
    }else if(pencolor.value == 5){
        colorchanged = "#6699ff"
    }else if(pencolor.value == 6){
        colorchanged = "#cc66ff"
    }else if(pencolor.value == 7){
        colorchanged = "#e8e8e8"
    }else if(pencolor.value == 8){
        colorchanged = "#ffffff"
    }else if(pencolor.value == 9){
        colorchanged = "#000033"
    }
  
   a.setpenColor(colorchanged,pencolor.value);
};

read.onclick = function() {
    a.Read()
};

clean.onclick = function() {
    a.clean()
    
};

save.onclick = function() {
    a.save(100)
};


window.addEventListener('message', function(e) {
                        // e.detail contains the transferred data
                   //     console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
                        if (!!e.data.data.account){
                        //document.getElementById("accountAddress").innerHTML= "Account address: " + e.data.data.account;
                        }
                        if (!!e.data.data.receipt){
                        //document.getElementById("txResult").innerHTML = "Transaction Receipt\n" +  JSON.stringify(e.data.data.receipt,null,'\t');
                        }
                        if (!!e.data.data.neb_call){
                        var result = e.data.data.neb_call.result
                    //    console.log("return of rpc call: " + JSON.stringify(result))
                        
                        if (result === 'null'){
                        console.log("meidongxi")
                        } else{
                        
                        try{
                        a.clean();
                        result = JSON.parse(e.data.data.neb_call.result);
                        console.log(result.value);
                        if(result.value){
                        var points = result.value.split('|');
                        for (var i=0;i<points.length;i++)
                        {
                       //console.log(points[i]);
                        if(points[i]!=""){
                        var point=points[i].split(':');
                       // console.log(point);
                        var drawp=point[1].split(',');
                        
                        var xz = drawp[0];
                        var yz = drawp[1];
                        var savecolorz = drawp[2];
                      //
                    
                        let q = {};

                        q.x = parseInt(parseInt(drawp[0]));
                        q.y = parseInt(parseInt(drawp[1]));
                        var colorsaved=parseInt(drawp[2]);
                        console.log(colorsaved);
                        if(colorsaved == 1){
                        colorchanged = "#ff0033"
                        }else if(colorsaved == 2){
                        colorchanged = "#ff9900"
                        }else if(colorsaved == 3){
                        colorchanged = "#ffff99"
                        }else if(colorsaved == 4){
                        colorchanged = "#66ff66"
                        }else if(colorsaved == 5){
                        colorchanged = "#6699ff"
                        }else if(colorsaved == 6){
                        colorchanged = "#cc66ff"
                        }else if(colorsaved == 7){
                        colorchanged = "#e8e8e8"
                        }else if(colorsaved == 8){
                        colorchanged = "#ffffff"
                        }else if(colorsaved == 9){
                        colorchanged = "#000033"
                        }
                        a.setpenColor(colorchanged,colorsaved);
                        a.toggleClick(q)
                  
                        }
                        }
                        }
                        
                        }catch (err){
                        
                        }
                        
                        if (!!result.key){
   
                        }
                        
                        }
                        
                        }
                        });

down.onclick = function() {
    download(canvas.toDataURL(), 'test.png', 'image/png')
}
