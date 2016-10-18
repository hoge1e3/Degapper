#include<stdio.h>
int main () {
  FILE *fp;
  int data;
  fp=fopen("hello.txt","r");
  if (fp==NULL) {
     printf("ƒtƒ@ƒCƒ‹ hello.txt‚Í‚ ‚è‚Ü‚¹‚ñ\n");
     exit(1);
  }
  fscanf(fp, "%d", &data);
  printf ("%d",data);
  fclose(fp);
}
