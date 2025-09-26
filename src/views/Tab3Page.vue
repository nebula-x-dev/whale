<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title>وال سیگنال</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="fetchData" :disabled="loading">{{ loading ? 'بارگذاری...' : 'تازه‌سازی' }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- LICENSE SCREEN -->
      <div v-if="!licenseValid" class="license-screen">
        <h3>ورود لایسنس</h3>
        <textarea v-model="licenseKey" placeholder="کلید لایسنس را وارد کنید..." rows="4"></textarea>
        <ion-button @click="submitLicense">ورود</ion-button>
        <p v-if="licenseError" style="color:#f87171">{{ licenseError }}</p>
      </div>

      <!-- MAIN APP -->
      <div v-else>
        <ion-card>
          <ion-card-header>
            <ion-card-title>آخرین بروزرسانی: {{ lastUpdated }}</ion-card-title>
          </ion-card-header>
        </ion-card>

        <ion-card v-if="tickers.length === 0 && loading">
          <p>در حال بارگذاری سیگنال‌ها...</p>
        </ion-card>

        <ion-card v-for="ticker in filteredTickers" :key="ticker.symbol">
          <ion-item>
            <ion-label>
              <h2>{{ ticker.symbol }}</h2>
              <p>{{ ticker.marketType }}</p>
            </ion-label>
            <ion-note slot="end" :color="ticker.daily_change_price > 0 ? 'success' : 'danger'">
              {{ ticker.daily_change_price.toFixed(2) }}%
            </ion-note>
          </ion-item>
          <ion-item>
            <ion-label>قیمت: {{ formatNumber(ticker.price) }}</ion-label>
            <ion-label>امتیاز: {{ ticker.score.toFixed(3) }}</ion-label>
            <ion-badge :color="signalColor(ticker.signal)">{{ ticker.signal }}</ion-badge>
          </ion-item>
        </ion-card>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonNote, IonBadge } from '@ionic/vue';

interface Ticker {
  symbol: string;
  marketType: string;
  price: number;
  daily_change_price: number;
  score: number;
  signal: string;
}

const licenseKey = ref('');
const licenseError = ref('');
const licenseValid = ref(false);

const tickers = ref<Ticker[]>([]);
const loading = ref(false);
const lastUpdated = ref('');

const apiUrl = 'https://api.bitpin.org/api/v1/mkt/tickers/';

// --- LICENSE LOGIC ---
function validateLicense(key: string) {
  try {
    const decoded = JSON.parse(atob(key.trim()));
    const exp = new Date(decoded.expiresAt);
    const now = new Date();
    if (now > exp) return { valid: false, reason: "لایسنس منقضی شده است." };
    return { valid: true, user: decoded.user, exp };
  } catch (e) {
    return { valid: false, reason: "کلید لایسنس نامعتبر است." };
  }
}

function submitLicense() {
  const result = validateLicense(licenseKey.value);
  if (!result.valid) licenseError.value = result.reason;
  else {
    localStorage.setItem('licenseKey', licenseKey.value);
    licenseValid.value = true;
    fetchData();
  }
}

// --- SIGNAL LOGIC ---
const parseNum = (v: any) => parseFloat(String(v).replace(/,/g,'').trim());
const formatNumber = (n: number) => isNaN(n) ? '-' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(n);
const computeScore = (item: any) => {
  const p = parseNum(item.price), low = parseNum(item.low), high = parseNum(item.high), change = parseNum(item.daily_change_price);
  const normChange = Math.max(-1, Math.min(1, change / 10));
  let posScore = 0;
  if(!isNaN(low) && !isNaN(high) && high>low && !isNaN(p)) {
    posScore = 1 - ((p-low)/(high-low))*2;
    posScore = Math.max(-1, Math.min(1,posScore));
  }
  let score = 0.6*normChange + 0.4*posScore;
  return Math.max(-1, Math.min(1,score));
};
const signalFromScore = (score: number) => {
  if(score>=0.6) return 'Strong Buy';
  if(score>=0.2) return 'Buy';
  if(score>-0.2) return 'Hold';
  if(score>-0.6) return 'Sell';
  return 'Strong Sell';
};
const signalColor = (sig: string) => {
  return { 'Strong Buy':'success','Buy':'primary','Hold':'medium','Sell':'warning','Strong Sell':'danger' }[sig] || 'medium';
};

// --- FETCH DATA ---
async function fetchData() {
  if (!licenseValid.value) return;
  loading.value = true;
  try {
    const res = await fetch(apiUrl);
    if(!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    tickers.value = data.map((it: any) => {
      const price = parseNum(it.price);
      const change = parseNum(it.daily_change_price);
      const score = computeScore({ ...it, price, daily_change_price: change });
      return {
        ...it, price, daily_change_price: change, score,
        signal: signalFromScore(score),
        marketType: it.symbol?.includes('_') ? it.symbol.split('_')[1] : 'unknown',
      };
    });
    lastUpdated.value = new Date().toLocaleTimeString('fa-IR');
  } catch(e: any) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// --- INITIALIZE ---
onMounted(() => {
  const savedKey = localStorage.getItem('licenseKey');
  if (savedKey && validateLicense(savedKey).valid) {
    licenseKey.value = savedKey;
    licenseValid.value = true;
    fetchData();
  }
});

// --- SEARCH/ FILTER ---
const filteredTickers = computed(() => tickers.value);
</script>

<style scoped>
.license-screen {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
textarea { width: 100%; border-radius: 8px; background:#061226; color:#cfe3ff; border:1px solid rgba(255,255,255,0.1); padding: 8px; }
</style>
