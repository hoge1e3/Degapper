#include<stdio.h>
int main () {
  FILE *fp;
  int data;
  fp=fopen("hello.txt","r");
  if (fp==NULL) {
     printf("ファイル hello.txtはありません\n");
     exit(1);
  }
  fscanf(fp, "%d", &data);
  printf ("%d",data);
  fclose(fp);
}
