<template>
  <ion-page>
    <ion-header>
      
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">نمودار ارز</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="4" v-for="(item, index) in charts" :key="index">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ item.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-img :src="item.url" alt="chart image"></ion-img>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

const charts = [
  { name: 'بیت کوین', url: 'https://mionapi.ir/api/arz/chart.php?coin=bitcoin' },
  { name: 'تتر ', url: 'https://mionapi.ir/api/arz/chart.php?coin=usdt' },
  { name: 'ترون', url: 'https://mionapi.ir/api/arz/chart.php?coin=tron' },
  { name: 'اتریوم', url: 'https://mionapi.ir/api/arz/chart.php?coin=ethereum' },
  { name: 'دوج کوین', url: 'https://mionapi.ir/api/arz/chart.php?coin=dogecoin' }

];
</script>
