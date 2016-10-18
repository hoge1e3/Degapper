int main(void) {
   int x,i,c;
   setColor(255,0,0); 
   x=100; c=0;
   for (i=0; i<10 ; i++) {
     setColor(c, 0, 0);
     fillRect(x, 30, 10, 50);
     x=x+20;  c=c+25;
   } 
   wait();
} 

