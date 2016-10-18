#include<stdio.h>
int main(void) {
  int i;
  int rank[5]={20,10,8,5,2};
  FILE* fp;
  fp=fopen("rank.txt", "w");
  for (i=0 ; i<5 ; i++) {
     fprintf(fp, "%d\n", rank[i]);
  }
  fclose(fp);
}
