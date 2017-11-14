
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
var mainInterval = null;
var game = {
  board:document.getElementById("board"),
  boardLength:30,
  rows:null,
  direction:null,
  gameIsStarted:false,
  snakeCoords:[],
  interval:null,
  speed:200,
  busy:false,
  point:-1,
  gameOverInterval:null,
  resetGameParameters:function(){
      this.rows=null;
      this.direction=null;
      this.gameIsStarted = false;
      this.snakeCoords=[];
      this.interval=null;
      this.speed=200;
      this.busy=false;
      this.point=-1;
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
      for(var i = 1;i<4;i++){
        this.snakeCoords.push({row:2,ind:i});
      }
      this.gameIsStarted = true;
      
      document.onkeydown = this.changeDirection;
  },
  startGame:function(){
      this.setCoords();
      this.setDirection('right'); 
      this.getNewPointBox();
  },
  setDirection:function(dir,isManual = false){
    this.direction = dir;
    if(!isManual) this.interval = setInterval(this.runSnakeRun,this.speed);
    else this.runSnakeRun(isManual);
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
    var lastIndex = this.snakeCoords.length-1;  
    this.snakeCoords.forEach(function(el,ind){
      if(lastIndex == ind) self.rows[el.row].querySelectorAll('.box')[el.ind].classList.add('snakeHead');
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
      this.point = this.point + 1;
      this.speed -= 0.1;
      document.getElementById("playerScore").innerHTML = this.point;

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
       el.classList.remove('snakeHead');
    })
    return self;
  },
  runSnakeRun:function(changeDir = false){
    var self = game;
    var newRow,newInd;
    
    // CLEAR INTERVAL
    if(changeDir) clearInterval(self.interval);
    
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
    if(!self.checkCoords(newCoords.slice(0,-1),newRow,newInd)) return self.gameOver();
    self.snakeCoords = newCoords;
    self.removeOldCoords().setCoords();
    if(changeDir) this.interval = setInterval(this.runSnakeRun,this.speed);
  },
  checkCoords:function(arr,row,ind){
    console.log(arr)
    console.log(row)
    console.log(ind)
    var gameContinues = true;
    for(var obj of arr){
      if(obj.row == row && obj.ind == ind) return gameContinues = false;
    }
    return gameContinues;
  },
  gameOver:function(){
    var self = this;
    clearInterval(this.interval);
    this.gameIsStarted = false;
    
    self.gameOverInterval = setInterval(function(){
      self.get('.black').forEach(function(el,ind){ el.classList.toggle('fakeBlack'); }); 
    },200);
   
    setTimeout(self.setGameOverContent,2000);
  },
  setGameOverContent:function(){
    var self = game;
    clearInterval(self.gameOverInterval);
    var gamoOverObject = document.getElementById('gameOverObject'); 
    gamoOverObject.style.width = self.board.offsetWidth + "px";
    gamoOverObject.style.height = self.board.offsetHeight + "px";
    document.getElementById('userScoreValue').innerHTML = self.point;
    var restartContent = document.getElementById('hiddenObject').innerHTML;
    self.board.innerHTML = restartContent;
  },
  restartGame:function(){
    this.board.innerHTML = "";
    this.resetGameParameters();
    this.init();
    this.startGame();
  },
  changeDirection:function(e){
    var self = game;
    if(!self.gameIsStarted) return;

      switch(e.keyCode){
        // up arrow
        case 38:
          if(self.direction != 'down') self.setDirection('up',true);   
        break;
        // down arrow
        case 40:
          if(self.direction != 'up') self.setDirection('down',true);
        break;
        // left arrow
        case 37:
          if(self.direction != 'right') self.setDirection('left',true);
        break;
        // right arrow
        case 39:
          if(self.direction != 'left') self.setDirection('right',true);
        break;
        default: return;
      }
  }
}

game.init();
