int main(void) {
   int x,i;
   setColor(255,0,0); 
   x=100;
   for (i=0; i<10 ; i++) {
     if (i==5) {
        fillRect(x, 100, 10, 50);
     } else {
        fillRect(x, 30, 10, 50);
     }
     x=x+20;
   } 
   wait();
} 
