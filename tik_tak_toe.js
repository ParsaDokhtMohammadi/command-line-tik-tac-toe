let readline = require("readline")
let fs = require("fs")
const { trace } = require("console")
const { parse } = require("querystring")
const { PassThrough } = require("stream")
const { toUnicode } = require("punycode")
let rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout,
    terminal: false
})
class TikTakToe {
    xUser = null
    oUser = null
    turn = "X"
    board = []
    xUserStats = 0
    oUserStats = 0
    playedMatches = 0
    constructor(xUser,oUser,board){
        this.oUser = oUser
        this.xUser = xUser
        this.board = board
    }
    createBoard=()=>{
        this.board = []
        for(let i = 0 ; i!=3 ; i++){
            this.board.push([null,null,null])
            
        }
    }
    printBoard = ()=>{
        for(let i = 0 ; i!= 3 ; i++){
            for(let j = 0 ; j!=3 ; j++){
                if (this.board[i][j] == null){
                    process.stdout.write(" |")

                }
                else{
                    process.stdout.write(this.board[i][j]+"|")
                }
            }
            console.log()
        }
  
    }
    curentPlayerTurn = ()=>{
        if (this.turn=="X"){
            console.log(this.xUser+"(X)'s" , "turn to move")
        }
        else{
            console.log(this.oUser+"(O)'s" , "turn to move")
        }
    }
    printStats = ()=>{
        if(this.xUser==null){
            console.log("there are no stats to be seen before starting a game")
        }
        else{
            console.log(`player ${this.xUser} has won ${this.xUserStats} games`)
            console.log(`player ${this.oUser} has won ${this.oUserStats} games`)
            console.log(`total played matches : ${this.playedMatches}`)
        }
    }
    boardHelper = ()=>{
        console.log("number to input for each space")
        console.log("1|2|3|")
        console.log("4|5|6|")
        console.log("7|8|9|")
    }
    listToBoardConverter = function(list){
        let new_board = []
        let temp = []
        for (let i = 0 ; i!=9 ; i++){
            temp.push(list[i])
            if (temp.length==3){
                new_board.push(temp)
                temp = []
            }
        }
        return new_board
    }
    boardToListConverter = function(){
        let allSpaces = []
        
        for(let row of this.board){
            for (let space of row){
                allSpaces.push(space)
            }
        }
        return allSpaces
    }
    inputToSpaceConverter = function(input){
        let allSpaces = []
        for(let row of this.board){
            for (let space of row){
                allSpaces.push(space)
            }
        }
        return allSpaces[input-1]
        
    }
    checkGameState = function(){
        for(let row of this.board){
            if(row.every(space=>space==this.turn))
                if(this.turn=="X"){
                    console.log(this.xUser,"won")
                    this.xUserStats ++
                    this.playedMatches ++
                    this.printStats()
                    return true
                }
                else{
                    console.log(this.oUser,"won")
                    this.oUserStats ++
                    this.playedMatches ++
                    this.printStats()
                    return true
                }
        }
        let diag1 = []
        let diag2 = []
        for (let i =0 ; i!=3; i++){
            diag1.push(this.board[i][i])
            diag2.push(this.board[i][2-i])
        }
        if(diag1.every(space=>space==this.turn) || diag2.every(space=>space==this.turn)){
            if(this.turn=="X"){
                console.log(this.xUser,"won")
                this.xUserStats ++
                this.playedMatches ++
                this.printStats()
                return true
            }
            else{
                console.log(this.oUser,"won")
                this.oUserStats ++
                this.playedMatches ++
                this.printStats()
                return true
            }
        }

        for (let i = 0 ; i!=3 ; i++){
            if(this.board[0][i]==this.board[1][i] && this.board[1][i]==this.board[2][i] && this.board[0][i]!= null){
                if(this.turn=="X"){
                    console.log(this.xUser,"won")
                    this.xUserStats ++
                    this.playedMatches ++
                    this.printStats()
                    return true
                }
                else{
                    console.log(this.oUser,"won")
                    this.oUserStats ++
                    this.playedMatches ++
                    this.printStats()
                    return true
                }
            }
        }
        let list = this.boardToListConverter()
        if(list.every(space => space!=null)){
            console.log("draw")
            this.playedMatches ++
            this.printStats()
            return true
        }
        return false
    }
    startGame = (xUser , oUser)=>{
        if(this.xUser != null){
            console.log("you can not start a new game before finishing the current game")
        }
        else{
            this.xUser = xUser
            this.oUser = oUser
            console.log(`game started between ${this.xUser} and ${this.oUser}`)
            this.createBoard()
            this.boardHelper()
            console.log()
            this.printBoard()
        }
    }
    Turn=()=>{
        if(this.turn=="X"){
            this.turn="O"
        }
        else{
            this.turn = "X"
        }
    }
    move = (input) =>{
        if(this.xUser=='' || this.oUser==''){
            console.log("you must start a game first")
        } 
        let space = this.inputToSpaceConverter(input)
        if (input>9 || input < 1){
            console.log("wrong cordinate")
        }
        else if (space != null){
            console.log("you can not play on an occupied space")
        }
        else{
            let listedBoard = this.boardToListConverter()
            listedBoard[input-1] = this.turn
            this.board = this.listToBoardConverter(listedBoard)
            console.log(`${this.turn} play ${input}`)
            let result = this.checkGameState()
            if(result == false){
                this.Turn()
                this.printBoard()
                this.curentPlayerTurn()
            }
            else{
                this.printBoard()
                console.log("restart or end game?   restart/end")
            }
            
        }
        
        
    }
    restartGame = ()=>{
        if(this.xUser==null){
            console.log("can not restart before starting a game")
        }
        else{
            this.turn == "X" ? this.turn="O" : this.turn = "X"

            console.log("game restarted")
            this.createBoard()
            this.boardHelper()
            console.log()
            this.printBoard()
            this.curentPlayerTurn()
        }
    }
    endGame = ()=>{
        if(this.xUser==null){
            console.log("can not end a game before starting a game")
        }
        else{
            console.log(`game between ${this.xUser} and ${this.oUser} ended`)
            this.xUser = null
            this.oUser = null
            this.xUserStats=0
            this.oUserStats=0
            this.board = []
            this.playedMatches = 0
        }
    }
    helper = ()=>{
        console.log("startgame xUser oUser")
        console.log("move number")
        console.log("stats")
        console.log("restart")
        console.log("end")
        console.log("help")
        console.log("exit")

    }
    exit = ()=>{
        console.log("exiting...")
        process.exit(0)
    }
}
let tiktaktoe = new TikTakToe()
rl.on('line', function (line) {
    let parts = line.trim().split(" ")
    if (parts[0] == "startgame" && parts.length == 3) {
        tiktaktoe.startGame(parts[1],parts[2])}
    else if (parts[0] == "move"){
        tiktaktoe.move(parts[1])
    }  
    else if (parts[0]=="boardHelper"){
        tiktaktoe.boardHelper()
    } 
    else if (parts[0]=="restart"){
        tiktaktoe.restartGame()
    }  
    else if (parts[0]=="end"){
        tiktaktoe.endGame()
    }
    else if (parts[0]=="exit"){
        tiktaktoe.exit()
    }
    else if(parts[0]=="stats"){
        tiktaktoe.printStats()
    }
    else if (parts[0]=="help"){
        tiktaktoe.helper()
    }
    else{
        console.log("invalid command")
    }


})