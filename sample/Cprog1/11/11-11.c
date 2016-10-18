#include<stdio.h>
int main () {
  FILE *fp;
  int data;
  fp=fopen("hello.txt","r");
  if (fp==NULL) {
     printf("ファイル hello.txtはありません\n");
     exit(1);
  }
  while (1) {
    int r=fscanf(fp, "%d", &data);
    if (r==EOF) break;
    printf ("%d\n",data);
  }
  fclose(fp);
}
