<!-- src/views/otp.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>ورود با OTP</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="box" style="max-width:520px;margin:24px auto;">
        <h3 v-if="step === 'phone'">وارد کردن شماره</h3>
        <h3 v-else>وارد کردن کد</h3>

        <div v-if="step === 'phone'">
          <ion-item>
            <ion-label position="floating">شماره موبایل</ion-label>
            <ion-input v-model="phone" type="tel" placeholder="09xxxxxxxxx"></ion-input>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="sendOtp">
            {{ loading ? 'در حال ارسال...' : 'دریافت کد' }}
          </ion-button>
        </div>

        <div v-else>
          <ion-item>
            <ion-label position="floating">کد دریافتی</ion-label>
            <ion-input v-model="otp" type="text" inputmode="numeric" placeholder="کد ۴ یا ۶ رقمی"></ion-input>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="verifyOtp">
            {{ loading ? 'در حال بررسی...' : 'تأیید کد' }}
          </ion-button>

          <ion-button fill="clear" class="ion-margin-top" @click="backToPhone">تغییر شماره</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/vue';

const router = useRouter();

const phone = ref('');
const otp = ref('');
const step = ref<'phone' | 'otp'>('phone');
const loading = ref(false);

/**
 * تنظیمات endpoint ها
 * دقت: اگر سرور CORS فعال نکرده باشه، درخواست‌ها بلاک میشه — پایین توضیح دادم.
 */
const SEND_OTP_URL = 'http://pichnikzad.ir/appa/otp.php';
const VERIFY_OTP_URL = 'http://pichnikzad.ir/appa/verify.php';

const showAlert = async (header: string, message: string) => {
  const a = await alertController.create({
    header,
    message,
    buttons: ['باشه'],
  });
  await a.present();
};

const sendOtp = async () => {
  if (!phone.value || phone.value.trim().length < 9) {
    await showAlert('خطا', 'لطفاً شماره معتبر وارد کنید.');
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(SEND_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phone.value.trim() })
    });

    if (!res.ok) {
      // پاسخ غیر 2xx
      throw new Error(`server error ${res.status}`);
    }

    const data = await res.json();

    if (data.status && data.status.toLowerCase() === 'success') {
      // پیام موفقیت — برای محیط تست ممکنه سرور otp رو برگردونه
      const dbg = data.otp ? `<br/><strong>کد (برای تست): ${data.otp}</strong>` : '';
      await showAlert('کد ارسال شد', (data.message ?? 'کد برای شما ارسال شد') + dbg);
      step.value = 'otp';
    } else {
      // سرور خطا داده
      await showAlert('خطا', data.message ?? 'مشکلی رخ داده است');
    }
  } catch (err: any) {
    console.error(err);
    await showAlert('خطا', 'ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید.');
  } finally {
    loading.value = false;
  }
};

const verifyOtp = async () => {
  if (!otp.value || otp.value.trim().length < 3) {
    await showAlert('خطا', 'لطفاً کد دریافتی را وارد کنید.');
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(VERIFY_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phone.value.trim(), otp: otp.value.trim() })
    });

    if (!res.ok) throw new Error(`server error ${res.status}`);

    const data = await res.json();

    if (data.status && data.status.toLowerCase() === 'success') {
      // موفقیت — ریدایرکت دائمی به /tabs/
      // اگر می‌خواهی router.push استفاده کنی: router.push('/tabs/')
      // اما خواستی "ریدایرکت دائمی" مثل window.location.replace:
      await showAlert('موفقیت', data.message ?? 'کد صحیح است. در حال انتقال...');
      // در اینجا می‌تونیم localStorage لایسنس رو هم ست کنیم اگر نیاز باشه:
      localStorage.setItem('licenseValid', 'false');
      // ریدایرکت دائمی:
      window.location.replace('/tabs/');
    } else {
      await showAlert('خطا', data.message ?? 'کد اشتباه است');
    }
  } catch (err: any) {
    console.error(err);
    await showAlert('خطا', 'ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید.');
  } finally {
    loading.value = false;
  }
};

const backToPhone = () => {
  otp.value = '';
  step.value = 'phone';
};
</script>

<style scoped>
/* استایل خیلی ساده */
.box { direction: rtl; }
</style>
