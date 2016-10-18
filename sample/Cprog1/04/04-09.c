#include"x.h"
void sankaku(int x, int y);

int main (void) {
     setColor(0,0,0);
     sankaku(200, 100);
     sankaku(300, 200);
     wait();
}
void sankaku(int x, int y) {
   setPen(x, y);
   movePen(100, 100);
   movePen(-200, 0);
   movePen(100, -100);
}
