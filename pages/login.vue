<template>
  <div class="login-screen">
    <div class="container pb-10">
      <div class="col-4 login-container pt-4 pb-5 text-center">
        <img class="mb-4 mt-3" src="/img/logo-dark.png">
        <div class="mb-4 login-btn-container">
          <GoogleLogin
            :params="googleLoginParams"
            :renderParams="googleLoginRenderParams"
            :onSuccess="onSuccess"
            :onFailure="onFailure">
          </GoogleLogin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleLogin from 'vue-google-login'

export default {
  layout: 'no-navigation',
  data () {
    return {
      googleLoginParams: {
          client_id: "692688683460-1h6sse28upuq3q79h63t8f13vkoi2pin.apps.googleusercontent.com"
      },
      googleLoginRenderParams: {
          width: 250,
          height: 50,
          longtitle: true
      }
    }
  },
  components: {
    GoogleLogin
  },
  methods: {
    onSuccess (googleUser) {
      const token = googleUser.xc.id_token
      try {
        // // TODO: Auth api call.
        // const res = await this.$axios.post('/', {
        //   token
        // })
        // localStorage.setItem('JWT', res.data.authToken);
        this.$router.replace('/');
      } catch (error) {
        console.log(error)
      }
    },
    onFailure (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>
.login-screen {
  background-image: radial-gradient(circle, #e3c5ed, #d5a6e4, #c687da, #b768cf, #a745c4);
}
.login-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0px auto;
}
.login-container {
  background-color: white;
  padding-top: -100px;
  border-radius: 20px;
  border: 1px solid #a745c4;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
