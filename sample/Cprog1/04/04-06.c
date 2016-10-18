#include"x.h"

void sankaku() {
   movePen(100, 100);
   movePen(-200, 0);
   movePen(100, -100);
}
int main (void) {
     setColor(0,0,0);
     setPen(200, 100);
     sankaku();
     setPen(300, 200);
     sankaku();
     wait();
}

