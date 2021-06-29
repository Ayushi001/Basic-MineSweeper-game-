document.addEventListener('DOMContentLoaded', () => {
    const grid=document.querySelector('.grid')
    let width = 10
    let bombsAmount=20
    let squares = []
    let isGameOver = 0
    let flags=0
    
    //create board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombsAmount).fill('bomb') //creates an array of 20 elements having string 'bomb'
        const emptyArray = Array(width * width - bombsAmount).fill('valid')
        
        // console.log(bombsArray)
        // console.log(emptyArray)

        const gameArray = emptyArray.concat(bombsArray) //concatenates the 2 arrays together in same order as specified
        // console.log(gameArray)

        const shuffledArray = gameArray.sort(() => Math.random()-0.5) //sorts the gameArray randomly and save it in shuffled array
        //random() gives a value b/w 0 and 1, and >0 in sort means ascending and <0 means descending (:p)

        // console.log(shuffledArray)

        //Now add these shuffledArray words (valid/bomb) as class names to the square divs inside grid

        
        for (let i = 0; i < width * width; i++){ //100 squares created
            let square = document.createElement('div')
            square.setAttribute('id', i) //sets theid of the square div as i
            // square.setAttribute('class', shuffledArray[i])
            square.classList.add(shuffledArray[i]) //adds a class to the current square div
            grid.appendChild(square)
            squares.push(square)

            //normal click on each square
            square.addEventListener('click', function (e) {
                click(square) //call this click() function when u click on any square
                   //      if (square.classList.contains('bomb')) {
                   //       alert('GAME OVER')
                   //   }
                
            })

            //right click on any square to mark it as flag
            square.oncontextmenu = function (e) { //for right click

                e.preventDefault()
                addFlag(square)
            }


            // square.addEventListener('right click', function (e) { //THIS WON'T WORK
            //     e.preventDefault()
            //     addFlag(square)
            // })

        }



        //add numbers (by calculating bombs in all 8 possible directions at a given square)
        for (let i = 0; i < squares.length; i++){
            // const leftEdge = !(i % width)
            const leftEdge = (i % width === 0)
            const rightEdge = (i % width === width - 1)
            let total = 0
            
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !leftEdge && squares[i - 1].classList.contains('bomb')) total++ //left
                if (!rightEdge && squares[i + 1].classList.contains('bomb')) total++ //right
                if (i > width-1 && squares[i - width].classList.contains('bomb')) total++ //top
                if (i <= width * width - width - 1 && squares[i + width].classList.contains('bomb')) total++ //bottom
               
                if (i > width - 1 && !rightEdge && squares[i + 1 - width].classList.contains('bomb')) total++ //top-right
                if (i > width - 1 && !leftEdge && squares[i - 1 - width].classList.contains('bomb')) total++ //top-left
                if (i < width * width - width - 1 && !rightEdge && squares[i + 1 + width].classList.contains('bomb')) total++ //bottom-right
                if (i < width * width - width - 1 && !leftEdge && squares[i - 1 + width].classList.contains('bomb')) total++ //bottom-left
                                
                squares[i].setAttribute('data', total)
                console.log(squares[i])
                
                
            }
                

            
        }
            
            
    }
    createBoard()

    //add Flag on right-click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombsAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                checkForWin()
            }
            else {
                square.classList.remove('flag')
                flags--
                square.innerHTML=''
            }
            
        }
    }


    //left-click on square actions
    function click(square) { // this is to do checks on any kind of square, but checkSquare() is for checking empty valid squares only (whose total=0)
        let currentID=square.id
        if (isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            // alert('GAME OVER')
            gameOver(square)
        }
        else {
            let total = square.getAttribute('data') //get the number of the valid square
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            //empty square (total=0)
            checkSquare(square,currentID)
            square.classList.add('checked')
        }

    }

    //check neighbouring squares once a square is clicked
    function checkSquare(square, currentID) { //fan out if it's an empty square (total=0) to all neighboring squares till we get a numbered square
        const leftEdge = (currentID % width === 0)
        const rightEdge = (currentID % width === width - 1)

         setTimeout(() => {
            if (currentID > 0 && !leftEdge) { //left
                const newID = squares[parseInt(currentID) - 1].id //id of the left square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

             if (!rightEdge) { //right
                const newID = squares[parseInt(currentID) + 1 ].id //id of the right square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

     
            if (currentID > width-1) { //top
                const newID = squares[parseInt(currentID) - width].id //id of the top square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }
            if (currentID <= width*width-1-width) { //bottom
                const newID = squares[parseInt(currentID) + width].id //id of the bottom square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

            if (currentID > width-1 && !rightEdge) { //top-right
                const newID = squares[parseInt(currentID) + 1 - width].id //id of the top-right square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

            if (currentID > width-1 && !leftEdge) { //top-left
                const newID = squares[parseInt(currentID) - 1 - width].id //id of the top-left square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

            if (currentID <=width*width-1 -width && !leftEdge) { //bottom-left
                const newID = squares[parseInt(currentID) - 1 + width].id //id of the bottom-left square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }

            if (currentID <width*width-1 -width && !rightEdge) { //bottom-right
                const newID = squares[parseInt(currentID) + 1 + width].id //id of the bottom-right square
                const newSquare = document.getElementById(newID)
                click(newSquare) //again do checks on it, and since it can be any kind of square, we'll go to click() func recursively
            }
            
        
            
        }, 10) //timeout of 10ms
        
    }

    //game OVER
    function gameOver(square) {
        console.log('BOOM!! gameover')
        isGameOver = 1
        
        //Show all bomb locations if there's a gameover
        squares.forEach(sq => {
            if (sq.classList.contains('bomb')) {
                sq.innerHTML='💣'
            }
                
        })
        
    }
    //check for win
    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
        }
        if (matches === bombsAmount) {
            console.log('YOU WON')
            isGameOver=1
        }
    }
    

})