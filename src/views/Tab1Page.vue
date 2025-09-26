<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="openModal">
            <ion-avatar class="avatar-pulse">
              <img :src="avatarUrl" />
            </ion-avatar>
          </ion-button>
          </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ExploreContainer name="" />

      <!-- Chat AI -->
      <div class="chat-container">
        <div class="chat-messages">
          <div v-for="(msg, index) in messages" :key="index" :class="msg.user === 'me' ? 'my-msg' : 'ai-msg'">
            {{ msg.text }}
          </div>
        </div>

        <ion-item>
          <ion-input
            placeholder="پیام خود را وارد کنید..."
            v-model="userMessage"
            @keydown.enter="sendMessage"
          ></ion-input>
          <ion-button @click="sendMessage">ارسال</ion-button>
        </ion-item>
      </div>
    </ion-content>

    <!-- Modal -->
    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>ثبت نام لایسنس</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">بستن</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="floating">نام</ion-label>
          <ion-input v-model="firstName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">نام خانوادگی</ion-label>
          <ion-input v-model="lastName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">کلید لایسنس</ion-label>
          <ion-input v-model="licenseKey"></ion-input>
        </ion-item>

        <ion-button expand="block" class="ion-margin-top" @click="submitForm">
          ثبت
        </ion-button>
      </ion-content>
    </ion-modal>

    <!-- Ionic Alert -->
    <ion-alert
      :is-open="showAlert"
      :header="alertHeader"
      :message="alertMessage"
      :buttons="['باشه']"
      @didDismiss="showAlert = false"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, 
  IonAvatar, IonModal, IonItem, IonLabel, IonInput, IonAlert 
} from '@ionic/vue';
// import ExploreContainer from '@/components/ExploreContainer.vue';

const router = useRouter();

// آواتار استاتیک
const avatarUrl = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');

const showModal = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

const firstName = ref('');
const lastName = ref('');
const licenseKey = ref('');

const validLicense = "12345-ABCDE";

const openModal = () => showModal.value = true;
const closeModal = () => showModal.value = false;

const submitForm = () => {
  if (licenseKey.value === validLicense) {
    localStorage.setItem('licenseValid', 'true'); 
    alertHeader.value = "موفقیت";
    alertMessage.value = "لایسنس معتبر است! حالا می‌توانید وارد Tab3 شوید.";
    showAlert.value = true;
    closeModal();
  } else {
    alertHeader.value = "خطا";
    alertMessage.value = "❌ لایسنس نامعتبر است!";
    showAlert.value = true;
  }
};

const canAccessTab3 = () => localStorage.getItem('licenseValid') === 'true';

// --- Chat AI ---
const userMessage = ref('');
const messages = ref<{user: string, text: string}[]>([]);

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;

  // اضافه کردن پیام کاربر
  messages.value.push({ user: 'me', text: userMessage.value });

  const query = encodeURIComponent(userMessage.value);
  const apiUrl = `http://ariyanwood.ir/test/ai.php?q=${query}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    messages.value.push({ user: 'ai', text: data.answer || '...' });
  } catch (err) {
    messages.value.push({ user: 'ai', text: 'خطا در ارتباط با سرور!' });
  }

  userMessage.value = '';
};
</script>

<style scoped>
.avatar-pulse {
  width: 40px;
  height: 40px;
  animation: pulse 2s infinite;
  border-radius: 50%;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 300px;
  margin: 16px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.my-msg {
  text-align: right;
  margin: 4px 0;
  background-color: #d1f0ff;
  padding: 6px 10px;
  border-radius: 10px;
}

.ai-msg {
  text-align: left;
  margin: 4px 0;
  background-color: #0031f3;
  padding: 6px 10px;
  border-radius: 10px;
}
</style>
