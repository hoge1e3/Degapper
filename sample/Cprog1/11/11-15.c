#include<stdio.h>
int main(void) {
  int i;
  int rank[5];
  FILE* fp;
  fp=fopen("rank.txt", "r");
  i=0;
  while (1) {
     int r=fscanf(fp, "%d",&rank[i]);
     if (r==EOF) break;
     i++;
  }
  fclose(fp);
  //表示（確認用)
  for (i=0 ; i<5; i++) {
     printf("No %d.  score=%d\n", i, rank[i]);
  }
}
