#include<stdio.h>
#include<stdlib.h>
#include<time.h>
int main(void){
	int answer,input;
	srand( time(NULL));
	answer =rand()%100;
	while(1){
		printf("��������͂��Ă��ĂĂ�������\n");
		scanf("%d",&input);
		if(input==answer){
			printf("������\n");
			break;
		}
		if(input>answer){
			printf("�傫��\n");
		}
		if(input<answer){
			printf("������\n");
		}
	}
}
