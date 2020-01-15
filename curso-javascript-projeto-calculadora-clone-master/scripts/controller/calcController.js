class CalcController {

    constructor(){
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastNumber = ''
        this._lastOperator = ''

        this._operation = []
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('#display')
        this._dateEl = document.querySelector('#data')
        this._timeEl = document.querySelector('#hora')
        this._currentDate
        this.initialize()
        this.initButtonsEvent()
        this.initKeyboard()
        
    }
    // metodo para iniciar a hora e data no display da calculadora
    initialize(){

          this.setDisplayDateTime
       setInterval(()=>{
          this.setDisplayDateTime()
       },1000)

        this.setLastNumbertoDisplay()
        this.pasteFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            })
        })
       
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff
    }

    playAudio(){

        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }

    }
    
    setDisplayDateTime(){
        this.displayDate = this.dataAtual.toLocaleDateString(this._locale,{
            day:'2-digit',
            month:'long',
            year:'numeric'
        })
        this.displayTime = this.dataAtual.toLocaleTimeString(this._locale)
    }
// metodo para copiar o texto do display da calculadora para area de transferencia
    copyToClipboard(){
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        input.remove()
    }
    
    pasteFromClipboard(){

        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text')

           this.displayCalc = parseFloat(text)
        })
        
    }
//metodo para adicionar eventos do teclado
    initKeyboard(){
      
        addEventListener('keyup', e=>{

            this.playAudio()
            
            switch(e.key){
                case 'Escape':
                   this.clearAll()
                     break
                case 'Backspace':
                   this.clearEntry()
                    break
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key)
                     break
                case 'Enter':
                case '=':
                   this.calc()
                     break
                case '.':
                case ',':
                    this.addDot()
                    break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                  this.addOperation(parseInt(e.key))
                  break
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard()
                    break
                
            }
        
        })



    }
    // metodo criado para adicionar varios eventos
    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false)
        })
        
    }
    //metodo usado ao ser usado o botao ac(limpa a tela)
    clearAll(){
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''
        this.setLastNumbertoDisplay()
    }
    //metodo usado ao se clicar no botao ce(volta para a penultima entrada)
    clearEntry(value){
        this._operation.pop()
        this.setLastNumbertoDisplay()
    }
  //retorna a ultima operaçao que esta no vetor
    getLastOperation(){
        return this._operation[this._operation.length-1]
    }
   //verifica se o valor digitado é um operador
    isOperator(value){ 
     
        return (['+','-','*','/','%'].indexOf(value) > -1)
        

    }
  //atribui o valor digitado à ultima operação
    setLastOperation(value){
        this._operation[this._operation.length-1] = value
    }

   //adiciona o valor digitado na ultima posicao do vetor
    pushOperation(value){
        this._operation.push(value)

        if (this._operation.length>3){
            
           this.calc() 
           this.setLastNumbertoDisplay()

        }
    }
  //junta os valores do vetor em uma so string, e pelo metodo eval calcula o valor da operação
    getResult(){
        
        try{
        return eval(this._operation.join(""))
        } catch(e){
            setTimeout(()=>{
                this.setError()
            },1)
        }

    
    }
 //metodo para calcular o valor das operações
    calc() {
       
        let last = ''
        this._lastOperator = this.getLastItem()
    
     if (this._operation.length < 3 ){

        let firstItem = this._operation[0]
        this._operation = [firstItem, this._lastOperator, this._lastNumber]
     }

     if (this._operation.length > 3) {
        last = this._operation.pop()
        this._lastNumber = this.getResult()

     } else if (this._operation.length == 3){
        this._lastNumber = this.getLastItem(false)
     }
     
       let result = this.getResult()

       if (last == '%'){
           result /= 100
           this._operation = [result]
       } else {

        this._operation = [result]

        if (last) this._operation.push(last)
        
       }
       
       this.setLastNumbertoDisplay()
    }
  // metodo usado para pegar o ultimo item do vetor
    getLastItem(isOperator = true) {
        let lastItem

        for(let i= this._operation.length-1; i>=0; i--){
           
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i]
                break
            }
        
       }
       if (!lastItem){

          lastItem = (isOperator) ? this._lastOperator : this._lastNumber
       }

       return lastItem
    }

    setLastNumbertoDisplay(){

       let lastNumber = this.getLastItem(false)

      
       if (!lastNumber) lastNumber = 0

       this.displayCalc =  lastNumber
    }

    addOperation(value){

        if (isNaN(this.getLastOperation())){

            if (this.isOperator(value)){

                this.setLastOperation(value)
                this.setLastNumbertoDisplay()

            }  else {
                this.pushOperation(value)
                this.setLastNumbertoDisplay()
            }  
         } else {

             if (this.isOperator(value)){

              this.pushOperation(value)

             } else {

            let newValue = this.getLastOperation().toString() + value.toString()
            this.setLastOperation(newValue)

            this.setLastNumbertoDisplay()
        }
    }
}

    addDot(){
     
        let lastOperation = this.getLastOperation()

        if(typeof lastOperation ==='string' && lastOperation.split('').indexOf('.')> -1) return

        if (this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.')
        } else {

            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumbertoDisplay()
      
    }


    setError(){
        this.displayCalc = "Error!"
    }

    execBtn(value){

        this.playAudio()
        
        switch(value){
            case 'ac':
               this.clearAll()
            break
            case 'ce':
                this.clearEntry()
            break
            case 'soma':
                this.addOperation('+')
            break
            case 'subtracao':
                this.addOperation('-')
            break
            case 'multiplicacao':
                this.addOperation('*')
            break
            case 'divisao':
                this.addOperation('/')
                 break
            case 'porcento':
                this.addOperation('%')
                 break
            case 'igual':
               this.calc()
                 break
            case 'ponto':
                this.addDot()
                 break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              this.addOperation(parseFloat(value))
             break

            default:
               this.setError()
        }
    }
    initButtonsEvent(){
      let buttons =  document.querySelectorAll('#buttons > g, #parts > g')

          
      buttons.forEach((btn,index)=>{

          this.addEventListenerAll(btn, 'click drag', e=>{
              console.log(btn.className.baseVal.replace('btn-',''))
              let textBtn = btn.className.baseVal.replace('btn-','')
              this.execBtn(textBtn)
          })
          this.addEventListenerAll(btn, 'mouseover mousedown mouseup', e=>{
              btn.style.cursor = "pointer"
          })
      })
    }
    get displayDate(){
        return this._dateEl.innerHTML
    }
    set displayDate(value){
        return this._dateEl.innerHTML=value
    }
    get displayTime(){
        return this._timeEl.innerHTML
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML
    }
    set displayCalc(value){

      if (value.toString().length >10){
          this.setError()
          return false
      }

     this._displayCalcEl.innerHTML = value
    }
    get dataAtual(){
        return new Date()
    }
    set dataAtual(value){
     this._currentDate = value
    }
}