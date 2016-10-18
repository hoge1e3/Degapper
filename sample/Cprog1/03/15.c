int main(void) {
  int x,y,vx,vy;
  setColor(255,0,0);
  x=30; y=50; 
  vx=2; vy=1;
  while (x<300) {
@@ clear();
     fillRect(x,y , 50, 50);
     x=x+vx; y=y+vy;
     if (x>=200) {
       vx=-2;
     }
     update();
  }
  wait();
}
