def emitRNValue(int quotient, int divisor) {
 Map strokes = [1000:['M','?','?'],
 100:['C','D','M'],
10:['X','L','C'],
 1:['I','V','X']]
// Logic to be provided by you.
// Yes a switch statement works here.

 switch (quotient) {
        //we know that if the quotient is 1, 2 , 3 its just 3 lines
        case 1:
        case 2:
        case 3:
            print strokes[divisor][0] * quotient //multiply the stroke by the num to get 3 lines
            break
        case 4:
            print "${strokes[divisor][0]}${strokes[divisor][1]}" //here since we need two different strokes, add the quotes and dollarsign
            break
        case 5:
            print strokes[divisor][1]
            break
        case 6:
        case 7:
        case 8:
            print "${strokes[divisor][1]}" + strokes[divisor][0] * (quotient - 5)
            break
        case 9:
            print "${strokes[divisor][0]}${strokes[divisor][2]}"
            break
        default:
            break
    }
}
def processNumber(int n) {
 print "Number: ${n} "
 int divisor = 1000
 while (n > 0) {
 // need integer division here
 int quotient = n.intdiv(divisor)
 emitRNValue(quotient,divisor)
 //println "divisor: ${divisor} quotient ${quotient}"
 // now make the number and divisor smaller
 n = n - quotient * divisor
 divisor = divisor.intdiv(10)
 }
 println()
}
// body of scriptprocessNumber(3569)
processNumber(1234)