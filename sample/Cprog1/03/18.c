#include<stdio.h>
#include<stdlib.h>
#include<time.h>
int main(void){
	int answer,input;
	srand( time(NULL));
	answer =rand()%100;
	while(1){
		printf("数字を入力してあててください\n");
		scanf("%d",&input);
		if(input==answer){
			printf("あたり\n");
			break;
		}
		if(input>answer){
			printf("大きい\n");
		}
		if(input<answer){
			printf("小さい\n");
		}
	}
}
