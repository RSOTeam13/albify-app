<template>
  <div>  
    <div class="container text-left mt-5">
      <div class="row mt-5 pt-5" v-if="albums.length > 0">
        <div v-for="(album) in albums" :key="album.id" class="col-4 pb-4 album-box">
          <b-card :title="album.name" :sub-title="album.createdAt">
            <b-button v-if="album.images && album.images.length > 0" @click="showAlbumImages(album)" class="mt-3" size="sm">Open</b-button>
            <b-button @click="removeAlbum(album.id)" class="mt-3" size="sm">Remove</b-button>
          </b-card>
        </div>
      </div>
      <div v-else class="mt-5 pt-5">
        You haven't created any albums yet.
      </div>
    </div>
    <div class="fab" v-b-modal.modal-create-album>
      +
    </div>
    <b-modal
      id="modal-create-album"
      ref="modal"
      title="Create new album"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Album name"
          label-for="name-input"
          invalid-feedback="Album name is required!"
          :state="newAlbumNameState"
        >
          <b-form-input
            id="name-input"
            v-model="newAlbumName"
            :state="newAlbumNameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-show-album"
      size="xl"
      centered
      scrollable
      hide-footer
      @hidden="resetModal"
      >
      <template #modal-title>
        <span>Album {{ selectedAlbum.name }} images</span>
      </template>

      <div class="row mt-2" v-if="selectedAlbumImages.length > 0">
        <div v-for="(image) in selectedAlbumImages" :key="image.id" class="col-4 pb-4">
          <b-card>
            <img :src="image.url" width="100%" height="100%"/>
            <b-button @click="removeImageFromAlbum(selectedAlbum.id, image.id)" class="mt-3" size="sm">Remove</b-button>
          </b-card>
        </div>
      </div>
      <div v-else class="mt-5 mb-5 pl-3">
        There are no images in this album.
      </div>
    </b-modal>		
  </div>
</template>

<script>
export default {
  data () {
    return {
      albums: [],
      newAlbumName: '',
      newAlbumNameState: null,
      selectedAlbum: {},
      selectedAlbumImages: [],
    }
  },
  async mounted () {
    await this.getAlbums()
  },
  methods: {
    async getAlbums() {
      try {
        const res = await this.$axios.get('/albums')
        this.albums = res.data
      } catch (error) {
        console.log(error)
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.newAlbumNameState = valid
      return valid
    },
    resetModal() {
      this.newAlbumName = ''
      this.newAlbumNameState = null
      this.selectedAlbum = {}
      this.selectedAlbumImages = []
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }

      try {
        const res = await this.$axios.post('/albums', {
          name: this.newAlbumName
        })

        this.albums.push(res.data)
        this.$bvModal.hide('modal-create-album')

        this.$bvToast.toast('Album was created successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while creating new album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }      
    },
    async showAlbumImages(album) {
      this.selectedAlbum = album
      
      try {
        const res = await this.$axios.get(`/albums/${this.selectedAlbum.id}/images`)
        this.selectedAlbumImages = res.data
        this.$bvModal.show('modal-show-album')
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while loading album images.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async removeAlbum(id) {
      try {
        const res = await this.$axios.delete(`/albums/${id}`)
        this.albums = this.albums.filter((a) => a.id !== id)

        this.$bvToast.toast('Album was removed successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while removing the album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }      
    },
    async removeImageFromAlbum(albumId, imageId) {
      try {
        const res = await this.$axios.delete(`/albums/${albumId}/images/${imageId}`)
        this.selectedAlbumImages = this.selectedAlbumImages.filter((i) => i.id !== imageId)

         this.$bvToast.toast('Image was removed successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while deleting image from album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
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

.album-box {
  min-width: 340px;
}

</style>
