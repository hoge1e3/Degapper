#include<stdio.h>
int main () {
  FILE *fp;
  fp=fopen("hello.txt","w");
  fprintf(fp,"%d\n", 10);
  fclose(fp);
}
