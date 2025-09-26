<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>داشبورد</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>چارت</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" class="signal-tab">
          <div class="blinker"></div>
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>سیگنال ها</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>

<style scoped>
.signal-tab {
  position: relative;
}

.blinker {
  position: absolute;
  top: -1px;
  left: 56%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  animation: blink 1s infinite alternate;
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
