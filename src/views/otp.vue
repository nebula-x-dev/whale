<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>کد تأیید</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">شماره موبایل</ion-label>
        <ion-input v-model="phone" type="tel"></ion-input>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="sendOtp">
        ارسال کد
      </ion-button>

      <ion-item v-if="otpSent">
        <ion-label position="floating">کد دریافتی</ion-label>
        <ion-input v-model="otp" type="number"></ion-input>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" v-if="otpSent" @click="verifyOtp">
        تایید
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, alertController } from '@ionic/vue';

const phone = ref('');
const otp = ref('');
const otpSent = ref(false);

const sendOtp = async () => {
  if (!phone.value) {
    const alert = await alertController.create({
      header: 'خطا',
      message: 'شماره موبایل را وارد کنید',
      buttons: ['باشه']
    });
    await alert.present();
    return;
  }
  otpSent.value = true;
  console.log('OTP Sent to:', phone.value);
};

const verifyOtp = async () => {
  if (otp.value === '1234') {
    localStorage.setItem('licenseValid', 'true');
    const alert = await alertController.create({
      header: 'موفقیت',
      message: 'کد درست بود ✅',
      buttons: ['باشه']
    });
    await alert.present();
  } else {
    const alert = await alertController.create({
      header: 'خطا',
      message: 'کد وارد شده نادرست است ❌',
      buttons: ['باشه']
    });
    await alert.present();
  }
};
</script>

<style scoped>
.ion-margin-top {
  margin-top: 16px;
}
</style>
