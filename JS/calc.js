const h1 = document.querySelector('h1');

document.addEventListener('click', e => 
{
    let res = h1.innerText;
    let clc = 0;

    let element = e.target;
    if (element.tagName == 'BUTTON')
    { 
        res += element.innerText;
        
        if( res[0]==='0' || res[0]==='=' || res[0]==='*' || 
            res[0]==='/' || res[0]==='+' )
        {   res = res.slice(1); } 
    
        if( res[res.length-1]==='C')
        {   
            h1.innerText = '0';
            return;
        }
        if(res[res.length-1]==='+' || res[res.length-1]==='-')
        {  
            //only '-':
            if(res[0]==='-' && res.length==1)
            {
                h1.innerText = '-';
                return;
            }
            if(res[0]==='-' && Number.isNaN(res)) return;

            let last = Math.max(res.lastIndexOf('+'), res.lastIndexOf('-')) ; 
            //-or+ after *or/:
            if(res[last-1]==='*' || res[last-1]==='/')
            {
                h1.innerText = res.slice(0, -1);
                return;
            }
            let sign = res.match(/[+-]/);           
            let first = (sign===null) ?  -1  :  res.indexOf(sign);
             //negative first number:
            if(res[0]==='-')
            {
                let str = res.slice(1);
                sign = str.match(/[+-]/); 
                first =(sign===null) ?  -1  :  str.indexOf(sign);
                if(first!==-1)  first += 1;
            }         
            console.log(`first=${first}, last=${last}`);     
            console.log(`res[first]=${res[first]}, res[last]=${res[last]}`);

            if(first <= last)
            {
                if(res.indexOf('*')===-1  &&  res.indexOf('/')===-1)
                {  
                    if(first < last)
                    {
                        clc = res[first]==='+'  ?
                            parseFloat(res) + parseFloat(res.slice(first+1, last)) :
                            parseFloat(res) - parseFloat(res.slice(first+1, last)) ;                
                        clc += res[last];   //'+' or '-';
                        res = clc;
                    }
                    console.log(res);
                }
                else
                {
                    let one = res.indexOf('*'), end = res.lastIndexOf('*');

                    one = one > -1  ?  one  :  res.indexOf('/');
                    end = end > -1  ?  end  :  res.lastIndexOf('/');
                    
                    if(one === end)
                    {
                        //first factor:
                        let ff = first===last ? parseFloat(res.slice(0, one)) :
                            parseFloat(res.slice(first+1, one ));

                        let sf = parseFloat(res.slice(one+1, last)); 

                        console.log(`first factor=${ff}, second one=${sf}`);

                        let tmp = 0;
                        //sign:
                        tmp = res[one] === '*' ?  ff * sf :  ff / sf ;
                        console.log(tmp);

                        if( first===last) clc = tmp;  
                        else
                        {
                            clc = res[first]==='+' ? 
                            parseFloat(res.slice(0, first)) + parseFloat(tmp) :
                            parseFloat(res.slice(0, first)) - parseFloat(tmp) ;
                        }
                        //Round with an accuracy of 4 tenths:
                        clc = Math.round(clc * 10000) / 10000;
                        clc += res[last];   //'+' or '-';
                        res = clc;
                        console.log(res);
                    }
                }
            }
        }
        else if(res[res.length-1]==='*' || res[res.length-1]==='/')
        {
            let one = 0, end = 0;

            if(res[res.length-1]==='*')
            {
                one = res.indexOf('*'), end = res.lastIndexOf('*');

                if((res.indexOf('/')>0) && (end===one || end===one+1))
                {
                    one = res.indexOf('/'), end = res.indexOf('*');
                }
            }
            if(res[res.length-1]==='/')
            {
                one = res.indexOf('/'), end = res.lastIndexOf('/');

                if((res.indexOf('*')>0) && (end===one || end===one+1))
                {
                    one = res.indexOf('*'), end = res.indexOf('/');
                }
            }
            //Twice * or twice /  or /* or */:
            if(end===one+1)
            {
                res = res.slice(0, -1);
                end = one;
            }
            if(one < end)
            {
                let first = Math.max(0, res.indexOf('+'), res.indexOf('-'));
                //first factor:
                let ff = parseFloat(res.slice( first, one ));
                //second one:
                let sf = parseFloat(res.slice( one+1, end ));

                let tmp = (res[one]==='*')  ?  ff*sf  :  ff/sf;
                console.log(tmp);
  
                clc = (first > 0)  ? 
                    parseFloat(res.slice(0, first)) + tmp  :  tmp;

                //Round with an accuracy of 4 tenths:
                clc = Math.round(clc * 10000) / 10000;
                clc += res[res.length-1];   //'*';
                res = clc;
                console.log(res);
            }
        }
        if( res[res.length-1]==='=')
        {
            let prev = res[res.length-2];
            if( prev==='*' || prev==='/' || 
                prev==='+' || prev==='-' || prev==='.')
            {   res = res.slice(0,-2) + '='; } 

            //if factor:
            let f = res.indexOf('*');
            if(f===-1)  f=res.indexOf('/');

            //if adder:
            let a = res.indexOf('+');
            if(a===-1)  a=res.lastIndexOf('-');

            if(f===-1 && a===-1) return;    //Empty input

            let n1 = 0, n2=0;
            clc = 0;
            if(f > 0)
            {
                n2 = parseFloat(res.slice(f+1));
                n1 = parseFloat(res.slice(Math.max(0,a)), f);
                clc = (res[f]==='*')  ?  n1 * n2  :  n1 / n2;
            }
            if(a > 0)
            {
                n1 = parseFloat(res.slice(0, a));
                if(f > 0)
                {
                    res = (res[a]==='+')  ?  n1 + clc  :  n1 - clc;
                }
                else
                {
                    n2 = parseFloat(res.slice(a+1));
                    res = (res[a]==='+')  ?  n1 + n2  :  n1 - n2;
                }            
            }
            else res = clc;

            //Round with an accuracy of 4 tenths:
            res = Math.round(res * 10000) / 10000; 
                       
            console.log(res);
        }        
        h1.innerText = res;
    }
})


