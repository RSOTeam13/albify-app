<template>
  <div style="margin-top: 8rem; margin-left: 3rem;">
    <div v-if="loading" class="container">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>

    <input type="file" ref="file" accept="image/*" @change="chooseFile">
    <br/>
    <button v-if="!circuitBreaker && !fallback && file" @click="demonstrateCircuitBreaker" class="mt-3">Demo circuit breaker</button>
    <button v-if="!circuitBreaker && !fallback && file" @click="demonstrateFallback" class="mt-3">Demo Fallback</button>
    <div v-for="(entry, idx) in responses" :key="idx">Called "{{ entry.path }}" = {{ entry.status }}: {{ entry.message }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      responses: [],
      file: null,
      circuitBreaker: false,
      fallback: false,
    }
  },
  async mounted () {
  },
  methods: {
    async chooseFile(event) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      this.file = file;
    },
    async demonstrateCircuitBreaker() {
      this.responses.push({path: "=========", status: "Circuit breaker demo", message: '========='})
      this.circuitBreaker = true;
      await this.callUpload(true);
      await this.callUpload(true);
      await this.callUpload(true);
      await this.callUpload(false);
      this.responses.push({path: "/", status: "/", message: 'Sleeping for 5s'})
      await setTimeout(async () =>{
        await this.callUpload(false);
        await this.callUpload(true);
        await this.callUpload(true);
        await this.callUpload(true);
        this.responses.push({path: "/", status: "/", message: 'Sleeping for 5s'})
        await setTimeout(async () =>{
          await this.callUpload(true);
          await this.callUpload(false);
          await this.callUpload(true);
          await this.callUpload(false);
          await this.callUpload(false);
          this.circuitBreaker = false;
        }, 5000)
      }, 5000)

    },
    async callUpload(fail) {
      const file = this.file;
      const extension = file.name.slice(file.name.lastIndexOf('.') + 1);

      console.log(file.type)
      console.log(file.mimeType)
      const path = `/upload-image-service/v1/upload${fail ? '?forceFailCreate=true' : ''}`;
      const data = { path };
      try {
        const res = await this.$axios.post(path,  file, {
          headers: {
            'Content-Type': 'application/octet-stream',     
          },
        });
        // console.log('res', res);
        this.responses.push({...data, status: res.status, message: res.data})
        this.$bvToast.toast('Image was successfully uploaded!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
        
      } catch (error) {
        console.log(error)
        if (error.response) {
          this.responses.push({...data, status: error.response.status, message: error.response.data})
        }
        this.$bvToast.toast('There was an error while uploading image.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async callUploadTagToggle(fail) {
      const file = this.file;
      const extension = file.name.slice(file.name.lastIndexOf('.') + 1);

      console.log(file.type)
      console.log(file.mimeType)
      const path = `/upload-image-service/v1/upload${fail ? '?forceFailTags=true' : ''}`;
      const data = { path };
      try {
        const res = await this.$axios.post(path,  file, {
          headers: {
            'Content-Type': 'application/octet-stream',     
          },
        });
        // console.log('res', res);
        this.responses.push({...data, status: res.status, message: res.data})
        this.$bvToast.toast('Image was successfully uploaded!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
        
      } catch (error) {
        console.log(error)
        if (error.response) {
          this.responses.push({...data, status: error.response.status, message: error.response.data})
        }
        this.$bvToast.toast('There was an error while uploading image.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async demonstrateFallback() {
      this.responses.push({path: "=========", status: "Circuit breaker demo", message: '========='})
      this.fallback = true;
      await this.callUploadTagToggle(true);
      await this.callUploadTagToggle(false);
      this.responses.push({path: "/", status: "/", message: 'Done :D Check the last 2 images for tags (1 fell back to empty array) :)'})
      this.fallback = false;

    },
  }
}
</script>

<style scoped>
.images {
  background: #f6f6f6;
}

.select-album {
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}

.fab {
  z-index: 900;
	position: fixed;
	width: 4rem;
	height: 4rem;
	bottom: 2.3rem;
	right: 2.3rem;
	background-color: #a745c4;
	color: white;
	border-radius: 50px;
	text-align: center;
  box-shadow: 2px 2px 3px #999;
  font-size: 50px;
  cursor: pointer;
}

.images .card-body {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
</style>
