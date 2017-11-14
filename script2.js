
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
var mainInterval = null;
var game = {
  board:document.getElementById("board"),
  boardLength:30,
  rows:null,
  direction:null,
  oposideDirection:null,
  oldDirection:null,
  gameIsStarted:false,
  snakeCoords:[],
  interval:null,
  speed:200,
  busy:false,
  setDirection:function(dir){
    this.direction = dir;
    return this;
  },
  init:function(){
      for(var i = 0; i<this.boardLength;i++){
        var row = document.createElement("div");
        row.classList.add('row');
        row.setAttribute('index',i);
        for(var j = 0; j<this.boardLength;j++){
          var div = document.createElement("div");
          div.classList.add("box");
          row.appendChild(div);
        }
        this.board.appendChild(row);
      }
      this.rows = document.querySelectorAll('.row');
      // this.direction = 'right';
      for(var i = 1;i<8;i++){
        this.snakeCoords.push({row:2,ind:i});
      }
      // add keypress listener
      //document.addEventListener("keypress",this.changeDirection);

      document.onkeydown = this.changeDirection;
  },
  startGame:function(){
    this.gameIsStarted = true;
    this.setCoords();
    this.setDirection('right'); 
    this.interval = setInterval(this.runSnakeRun,this.speed);
    this.getNewPointBox();
  },
  getPointsCoords:function(){
    var self = this;
    var element = self.get('.green')[0];
    if(typeof element == 'undefined') return {row:-1,ind:-1};
    var parent = element.parentNode;
    var ind = [].indexOf.call(parent.children, element);
    var row = parseInt(parent.getAttribute("index"));
    return {row:row,ind:ind};  
  },
  setCoords:function(){
    if(this.busy) return;
    this.busy = true;
    var self = this;
    var pointsCoords = self.getPointsCoords(); 
    var isPoint = false;
    var snakeHead = this.snakeCoords[this.snakeCoords.length-1];
    var snakeTail = this.snakeCoords[0];
    
    if(pointsCoords.row == snakeHead.row && pointsCoords.ind == snakeHead.ind) {
      isPoint = true  
      var newRow,newInd; 
      self.removeOldPoint(); 
      if(self.direction == 'up' || self.direction == 'down'){
        newRow = snakeTail.row - 1;
        newInd = snakeTail.ind; 
      }else{
        newRow = snakeTail.row;
        newInd = snakeTail.ind - 1; 
      }   
      this.snakeCoords.unshift({row:newRow,ind:newInd});
    } 

    this.snakeCoords.forEach(function(el,ind){
      self.rows[el.row].querySelectorAll('.box')[el.ind].classList.add('black');
    });
    if(isPoint) self.getNewPointBox(); 
    this.busy = false;
    return self;
  },
  removeOldPoint:function(){
    this.get('.green')[0].classList.remove('green');
  },
  getRandomIndex:function (min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  },
  getNewPointBox:function(){
      var boxes = document.querySelectorAll('.box');
      var randomIndex = this.getRandomIndex(0,boxes.length-1);
      var randomBox = boxes[randomIndex];
      if(randomBox.classList.contains('black')) return this.getNewPointBox();
      else randomBox.classList.add('green');
  },
  get:function(query){
    return document.querySelectorAll(query);
  },
  removeOldCoords:function(){
    var self = this;
    this.get('.black').forEach(function(el){
      el.classList.remove('black');
    })
    return self;
  },
  runSnakeRun:function(changeDir = false){
    var self = game;
    var newRow,newInd;
    if(changeDir) clearInterval(self.interval);
    console.log("old = [ "+self.oldDirection+" ], new = ["+self.direction+"]");
    //if(changeDir && isOppositeDireaciton(self.direction)) 

    var newCoords = self.snakeCoords.map(function(el,ind){
        // debugger;
        var nextInd = self.snakeCoords[ind+1];

        if(typeof nextInd == 'undefined'){
          //snake head
          switch(self.direction){
            case 'right': 
              newRow = el.row;
              newInd = (el.ind + 1 >= self.boardLength) ? 0 : el.ind + 1;
            break;
            case 'left': 
              newRow = el.row;
              newInd = (el.ind - 1 < 0) ? self.boardLength - 1 : el.ind - 1;
            break;
            case 'up':
              newRow = (el.row - 1 < 0) ? self.boardLength - 1 : el.row - 1;
              newInd = el.ind;
            break;
            case 'down':
              newRow = (el.row + 1 >= self.boardLength) ? 0 : el.row + 1;
              newInd = el.ind;
            break;
          }
        }
        else{
          newRow = nextInd.row;
          newInd = nextInd.ind;
        }

      return {row:newRow,ind:newInd};
    });
    self.snakeCoords = newCoords;
    console.log(newCoords);
    self.removeOldCoords().setCoords();
    if(changeDir) this.interval = setInterval(this.runSnakeRun,this.speed);
  },
  isOppositeDirection:function(keyNumber){
    var isOpposide = false;
    if(self.oldDirection === null ) return isOpposide;
    switch(keyNumber){
        // up arrow
        case 38:
          if(self.oldDirection == 'Down') isOpposide = true;
        break;
        // down arrow
        case 40:
          if(self.oldDirection == 'up') isOpposide = true;
        break;
        // left arrow
        case 37:
          if(self.oldDirection == 'right') isOpposide = true;
        break;
        // right arrow
        case 39:
          if(self.oldDirection == 'left') isOpposide = true;
        break;
        default: return isOpposide;
      }
      return isOpposide;
  }
  changeDirection:function(e){
    var self = game;
    if(!self.gameIsStarted) return;
    self.isOppositeDirection(e.keyCode);
    self.oldDirection = self.direction;

      switch(e.keyCode){
        // up arrow
        case 38:
          self.setDirection('up').runSnakeRun(true);
        break;
        // down arrow
        case 40:
          self.setDirection('down').runSnakeRun(true);
        break;
        // left arrow
        case 37:
          self.setDirection('left').runSnakeRun(true);
        break;
        // right arrow
        case 39:
          self.setDirection('right').runSnakeRun(true);
        break;
        default: return;
      }
  }
}

game.init();
