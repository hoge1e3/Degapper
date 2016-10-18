#include"x.h"
int main() {
  int i,j,r,c;
  printf("r=?");
  scanf("%d",&r);
  printf("c=?");
  scanf("%d",&c);
  drawGrid();
  for (i=0 ; i<r ; i++) {
  for (j=0 ; j<c ; j++) {
     fillRect(j*20, i*20,10,10); 
  }}
  wait();
}
