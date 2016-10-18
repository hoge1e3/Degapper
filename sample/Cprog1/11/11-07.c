#include<stdio.h>
int main () {
  FILE *fp;
  int data;
  fp=fopen("hello.txt","r");
  fscanf(fp, "%d", &data);
  printf ("%d",data);
  fclose(fp);
}
